const modal = document.getElementById("modal");
const grid = document.querySelector(".grid");

const nodes = {
  sidebarLeft: document.getElementById("sidebarLeft"),
  sidebarRight: document.getElementById("sidebarRight"),
  counter: document.getElementById("counter"),
  address: document.getElementById("address"),
  media: document.getElementById("media")
};
const modalClasses = {
  sidebarLeft: "modal__sidebar modal__sidebar--left",
  sidebarRight: "modal__sidebar modal__sidebar--right",
  counter: "modal__counter",
  address: "modal__address",
  media: "modal__media",
};
const dafaultClasses = {
  sidebarLeft: "grid__left sidebar sidebar--left",
  sidebarRight: "grid__right sidebar sidebar--right",
  counter: "counter",
  address: "address",
  media: "media",
};

function showModal() {
    modal.style.display = "grid";
    for (const [key, node] of Object.entries(nodes)) {
        node.setAttribute('class', modalClasses[key])
        modal.append(node);
    }
}
function hideModal() {
  modal.style.display = "none";
  for (const [key, node] of Object.entries(nodes)) {
    node.setAttribute("class", dafaultClasses[key]);
    grid.append(node);
  }
}
const elements = document.querySelectorAll(
  "#niedziela, #facebook, #youtube, #mail"
);
const links = {
  niedziela: "https://niezbednik.niedziela.pl/",
  facebook: "",
  youtube: "https://www.youtube.com/channel/UCdhcImbqZocrElkRBPPcGRg",
  mail: "mailto:nsjretkinia@archidiecezja.lodz.pl",
};
elements.forEach((element) => {
  element.addEventListener("click", () => {
    location.href = links[element.id];
  });
});
document.getElementById("searchButton").addEventListener("click", () => {
  location.href = `/ogloszenia/${document.getElementById("date").value}`;
});
var menuTrigger = document.getElementById("menuTrigger");
var closeButton = document.getElementById("closeButton");
menuTrigger.addEventListener("swiped-right", () => {
  showModal();
});
menuTrigger.addEventListener("click", () => {
  showModal();
});
closeButton.addEventListener("click", () => {
  hideModal();
});
