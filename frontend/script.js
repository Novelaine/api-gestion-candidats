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


let currentPage = 1;
  const limit = 5;
  let currentSearch = "";

async function loadCandidats() {

  candidatsList.innerHTML = "";

  try {

    const response = await fetch(
      `${API_URL}/candidats?page=${currentPage}&limit=${limit}&search=${currentSearch}`
    );

    const result = await response.json();
    const data = result.data;


    data.forEach(candidat => {

    const li = document.createElement("li");
    const date = new Date(candidat.created_at).toLocaleDateString();


      li.innerHTML = `
        <strong>${candidat.name}</strong> - ${candidat.email}<br>
        - Poste : ${candidat.poste_titre}<br>
        - Le : ${date}
        
        ${candidat.cv_summary ? `<br>Résumé : ${candidat.cv_summary}` : ""}
        ${candidat.score ? `<br>Score : ${candidat.score}%` : ""}
        <div class="actions">
        ${candidat.cv_path
          ? `<button class="read-btn"> <a href="${API_URL}/uploads/${candidat.cv_path}" target="_blank">Voir CV</a></button>`
          : ""}
        <br>
        <button class="delete-btn" data-id="${candidat.id}">Supprimer</button>
        </div>
      `;

      candidatsList.appendChild(li);
      li.classList.add("card");

    });

    const totalPages = Math.ceil(result.total / limit);
    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;

     prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;

  } catch (error) {
    console.error("Erreur :", error);
  }

}

loadBtn.addEventListener("click", async () => {
  currentPage = 1;
  loadCandidats();
});

searchBtn.addEventListener("click", () => {
  currentSearch = searchInput.value;
  currentPage = 1;
  loadCandidats();
});

nextPage.addEventListener("click", () => {
    currentPage++;
    loadCandidats();
});

prevPage.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadCandidats();
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
