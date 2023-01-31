const dashboardUser = document.querySelector(".dashboard-user");
const mobileMenue = document.querySelector(".menue-container");
const closeMobileMenue = document.querySelector(".menue-close");
const stories = document.querySelectorAll(".story");

/* MyData menue container control */
dashboardUser.addEventListener("click", (e) => {
  mobileMenue.classList.add("menue-container-expanded");
});

closeMobileMenue.addEventListener("click", (e) => {
  mobileMenue.classList.remove("menue-container-expanded");
});

/* Delete Story */
stories.forEach((story) => {
  const storyID = story.querySelector("#story-id").value;
  story.querySelector(".btn-delete").addEventListener("click", (e) => {
    deleteStory(storyID);
  });
});

const deleteStory = async (id) => {
  const res = await fetch(`http://localhost:4000/stories/delete/${id}`);
  if (res.ok) {
    window.location.reload();
  }
};
