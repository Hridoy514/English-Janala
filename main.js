const loginBtn = document.getElementById("login-btn");
const headerSection = document.getElementById("header-section");
const mainSection = document.getElementById("main-section");
const footerSection = document.getElementById("footer-section");
const heroSection = document.getElementById("hero-section");

// headerSection.style.display = "none";
// mainSection.style.display = "none";

// login function here
loginBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const heroSection = document.getElementById("hero-section");
  const inputName = document.getElementById("input-name").value.trim();
  const inputPassword = document.getElementById("input-password").value;

  if (inputName && inputPassword == "123456") {
    heroSection.style.display = "none";
    headerSection.style.display = "block";
    mainSection.style.display = "block";
    footerSection.style.display = "flex";
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Login Success",
      showConfirmButton: true,
      timer: 15000,
    });
  }
  if (inputName === "" && inputPassword !== "123456") {
    alert("Both are wrong please correction");
  } else {
    if (inputName === "") {
      alert("Enter Your Name");
    }
    if (inputPassword !== "123456") {
      alert("Wrong Password");
    }
  }
});

// logout function here
const logOutBtn = document.getElementById("logout-btn");
logOutBtn.addEventListener("click", () => {
  heroSection.style.display = "block";
  headerSection.style.display = "none";
  mainSection.style.display = "none";
});

const loadLevels = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/levels/all"
  );
  const data = await response.json();
  showLevels(data.data);
};

// all dynamic button here
const showLevels = (data) => {
  data.forEach((element) => {
    const divContainer = document.getElementById("dynamic-btn");

    const div = document.createElement("div");
    div.innerHTML = `<button onclick="loadCategory('${element.level_no}')" data-id="${element.id}" class="lesson-btn btn btn-xs btn-outline btn-primary text-xs"><i class="fa-solid fa-book-open"></i> ${element.lessonName}</button>`;

    divContainer.appendChild(div);
  });

  // highlight active button here
  document.querySelectorAll(".lesson-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const levelId = this.getAttribute("data-level");
      loadCategory(levelId);

      document.querySelectorAll(".lesson-btn").forEach((button) => {
        button.classList.remove("bg-primary", "text-white", "border-primary");
        button.classList.add("btn-outline");
      });

      this.classList.add("bg-primary", "text-white", "border-primary");
      this.classList.remove("btn-outline");
    });
  });
};

const loadCategory = async (id) => {
  showSpinner();
  const response = await fetch(
    `https://openapi.programming-hero.com/api/level/${id}`
  );
  const data = await response.json();
  if (data) {
    displayLessons(data.data);
    hideSpinner();
  }
};

// show words card here $ error container
const displayLessons = (lessons) => {
  const lessonsContainer = document.getElementById("lessons-container");
  const sectionToHide = document.getElementById("not-selected-lesson");

  lessonsContainer.innerHTML = "";
  sectionToHide.style.display = "none";

  // show error container here
  if (!lessons || lessons.length === 0) {
    lessonsContainer.innerHTML = `
        <div id="show-error" class="h-72 w-full mx-5 lg:mx-0 bg-[#ECECEC] rounded-lg text-center">
                <div class="space-y-3">
                    <img class="mx-auto" src="./assets/alert-error.png" alt="">
                    <p class="text-xs text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                    <p class="text-2xl font-semibold text-gray-700">নেক্সট Lesson এ যান</p>
                </div>
            </div>
        `;
    return;
  }

  // words card here
  lessons.forEach((lesson) => {
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="card h-[250px] w-96 shadow flex">
            <div class="flex flex-col w-[90%] mx-auto">
                <div class="text-center">
                    <div class="space-y-3">
                        <h2 class="text-2xl font-semibold">${lesson.word}</h2>
                        <p>${lesson.pronunciation}</p>
                        <h2 class="text-2xl font-semibold">${
                          lesson.meaning || "খুঁজে পাওয়া যায়নি"
                        }</h2>
                    </div>
                </div>
                <div class="flex justify-between mx-5 mt-10">
                    <button onclick="loadModal(${lesson.id})" class="btn bg-[#ECECEC]"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="btn bg-[#ECECEC]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        </div>
        `;
    lessonsContainer.appendChild(div);
  });
};

// spinner here
const showSpinner = () => {
  document.getElementById("loadingSpinner").style.display = "block";
};

const hideSpinner = () => {
  document.getElementById("loadingSpinner").style.display = "none";
};

// Modal here
const loadModal = (wordId) => {
  const url =(
    `https://openapi.programming-hero.com/api/word/${wordId}`
  );
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayModal(data.data));
};

const displayModal = (wordData) => {
  console.log(wordData);
  document.getElementById("my_modal_1").showModal();
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = "";

  const div = document.createElement("div");
  div.innerHTML = `
        <h3 class="text-xl font-bold">${
          wordData.word || "No Word Available"
        }</h3>
        <h3 class="text-lg font- mt-2">Meaning</h3>
        <p class="py-4">${wordData.meaning || "No Meaning Available"}</p>
        <h3 class="text-lg font-bold">Example</h3>
        <p class="py-4">${wordData.sentence || "No Example Available"}</p>
        <h3 class="text-lg font-bold">সমার্থক শব্দ গুলো</h3>
    `;

  const synonymsList = document.createElement("ul");
  synonymsList.classList.add("flex", "gap-2", "list-none");

  if (wordData.synonyms && wordData.synonyms.length > 0) {
    wordData.synonyms.forEach((synonym) => {
      const li = document.createElement("li");
      li.classList.add("btn", "btn-sm");
      li.textContent = synonym;
      synonymsList.appendChild(li);
    });
  } else {
    const noSynonyms = document.createElement("p");
    noSynonyms.classList.add("text-gray-500");
    noSynonyms.textContent = "No synonyms available";
    synonymsList.appendChild(noSynonyms);
  }

  div.appendChild(synonymsList);
  modalContent.appendChild(div);
};

loadLevels();
loadCategory("id");

