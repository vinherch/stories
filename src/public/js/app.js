const dashboardUser = document.querySelector(".dashboard-user");
const mobileMenue = document.querySelector(".menue-container");
const closeMobileMenue = document.querySelector(".menue-close");

/* mydata menue container control */
dashboardUser.addEventListener("click", (e) => {
  mobileMenue.classList.add("menue-container-expanded");
});

closeMobileMenue.addEventListener("click", (e) => {
  mobileMenue.classList.remove("menue-container-expanded");
});
