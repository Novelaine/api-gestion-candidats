const API_URL = "http://localhost:3000";
console.log("JS chargé");
document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("candidatForm");
const message = document.getElementById("message");
const loadBtn = document.getElementById("loadBtn");
const loadBtnP = document.getElementById("loadBtnP");
const candidatsList = document.getElementById("candidatsList");
const postesList = document.getElementById("postesList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const poste_id = document.getElementById("poste_id").value || null;
  const cvFile = document.getElementById("cv").files[0];

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("poste_id", poste_id);

  if(cvFile){
    formData.append("cv", cvFile);
  }

  try {
    const response = await fetch(`${API_URL}/candidats`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message;
      message.style.color = "red";
      return;
    }

    message.textContent = "Candidat créé avec succès !";
    message.style.color = "green";
    form.reset();

  } catch (error) {
    message.textContent = "Erreur de connexion au serveur";
    message.style.color = "red";
  }
});

loadBtn.addEventListener("click", async () => {
  candidatsList.innerHTML = "";

  try {
    const response = await fetch(`${API_URL}/candidats`);
    const data = await response.json();

    data.forEach(candidat => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${candidat.name}</strong> - ${candidat.email}
        ${candidat.cv_path ? 
          ` - <a href="${API_URL}/uploads/${candidat.cv_path}" target="_blank">Voir CV</a>` 
          : ""}
          - <button class="delete-btn" data-id="${candidat.id}">Supprimer</button>
      `;
      candidatsList.appendChild(li);
    });
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
        if (!confirm("Supprimer ce candidat ?")) return;
        try {
          await fetch(`${API_URL}/candidats/${id}`, {
            method: "DELETE"
          });
          button.parentElement.remove();
        } catch (error) {
          console.error("Erreur suppression :", error);
        }
      });
    });

  } catch (error) {
    console.error("Erreur:", error);
  }
});

loadBtnP.addEventListener("click", async () => {
  postesList.innerHTML = "";

  try {
    const response = await fetch(`${API_URL}/postes`);
    const data = await response.json();

    data.forEach(poste => {
      const li = document.createElement("li");
      li.textContent = `Id : ${poste.id} - ${poste.titre}`;
      postesList.appendChild(li);
    });

  } catch (error) {
    console.error("Erreur:", error);
  }
});

});
