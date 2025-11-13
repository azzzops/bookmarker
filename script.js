let userInput = document.getElementById("link");
let description = document.getElementById("aiInput");
let addBtn = document.getElementById("addBtn");
let form = document.getElementById("aiForm");
let sortList = document.getElementById("sortMethod");
let sortBtn = document.getElementById("sort");
let tagSpace = document.getElementById("tagsInput");
let tagId = document.getElementById("tags_id");
let tag = document.getElementById("tag");
let tagChildren = tag.querySelectorAll("span");
let orginalForm = document.getElementById("orgForm");
let tagInput = document.getElementById("tagInputer");
const archivedBtn = document.getElementById("loadArchivedItem");
const unArchivedBtn = document.getElementById("loadUnArchivedItem");
let filterSearch = []
let feedingData;
let filtered = [];
let sortedBookmarks = [];
let tagList = [];
let renderedTags = [];
let activeTags = {};

// check if bookmark exist if it does render it on the page if not create a new array

let bookmark = JSON.parse(localStorage.getItem("bookmark")) || [],
  editingId = false,
  archivedItems = false;

let data = () => {
  localStorage.setItem("bookmark", JSON.stringify(bookmark));
  bookmark = JSON.parse(localStorage.getItem("bookmark"));
};

// renderData(bookmark);
// for all event listener buttons
sortBtn.addEventListener("click", () => {
  if (sortList.classList.contains("hidden")) {
    sortList.classList.remove("hidden");
    sortList.classList.add("flex");
  } else {
    sortList.classList.add("hidden");
    sortList.classList.remove("flex");
  }
});

addBtn.addEventListener("click", () => {
  form.classList.remove("hidden");
  form.classList.add("flex");
});
form.addEventListener("click", (e) => {
  if (e.target.classList.contains("cancel")) {
    editingId = false;
    orginalForm.reset();
    tag.innerHTML = "";
    tagList = [];
    form.classList.add("hidden");
    form.classList.remove("flex");
  }
});

tagInput.addEventListener("change", () => {
  tagList.push(tagInput.value);
  tag.innerHTML = tagList
    .map(
      (t) => `
      <span class="inline-block px-4 py-[2px] text-center rounded-md text-white bg-[#3F7B70]">${t}</span>
    `
    )
    .join("");
  tagInput.value = "";
});

function renderTags() {
  let checkbox_tags = document.getElementById("checkbox_tags");
  let sortedByKey = Object.entries(activeTags).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  sortedByKey = sortedByKey.filter(t => t[0] != "")

  checkbox_tags.innerHTML = sortedByKey
    .map(
      ([value, key]) => `
    <label for="${value}" class="flex cursor-pointer justify-between items-center">
                    <div class="flex gap-2 items-center justify-center text-[17px]"><input type="checkbox"
                            class="tag-checkbox w-[17px] h-[17px] text-[#444941]" value="${value}" ${
        renderedTags.find((t) => t == value) ? "checked" : ""
      } name="filter" id="${value}"><label for="${value}" class="cursor-pointer" >${value}</label></div>
                    <div
                        class="bg-[#8C999A] text-[#F5F5F5] font-bold w-[20px] rounded-full flex justify-center p-2 items-center h-[20px]">
                        <span class="text-[12px]">${key}</span>
                    </div>
    </label>
  `
    )
    .join("");

  let checkboxes = document.querySelectorAll(".tag-checkbox");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      console.log("Checkbox changed:", checkbox.value);

      if (checkbox.checked) {
        renderedTags.push(checkbox.value);
      } else {
        renderedTags = renderedTags.filter((t) => t !== checkbox.value);
      }

      if (renderedTags.length != 0) {
        filtered = bookmark.filter((t) => {
          return renderedTags.some((tag) => t.tags.includes(tag));
        });
        renderData(filtered);
      } else {
        renderData(bookmark);
      }
    });
  });
}

function mostVisited() {
  if (renderedTags.length != 0) {
    sortedBookmarks = filtered;
    sortedBookmarks = sortedBookmarks.sort((a, b) => {
      return b.visited - a.visited;
    });
    renderData(sortedBookmarks);
  } else {
    sortedBookmarks = bookmark.sort((a, b) => {
      return b.visited - a.visited;
    });
    renderData(sortedBookmarks);
  }
}

function recentlyAdded() {
  if (renderedTags.length != 0) {
    renderData(filtered);
  } else {
    renderData(bookmark);
  }
  renderPinItems()
}

function recentlyVisited() {
  if (renderedTags.length != 0) {
    sortedBookmarks = filtered;
    sortedBookmarks = sortedBookmarks.sort((a, b) => {
      const [ah, am] = a.timed.split(" ")[0].split(":");
      const [bh, bm] = b.timed.split(" ")[0].split(":");

      return bh * 60 + bm - (ah * 60 + am);
    });
    renderData(sortedBookmarks);
  } else {
    let sortThroughTime = bookmark.filter((t) => t.id);
    sortThroughTime = sortThroughTime.sort((a, b) => {
      const [ah, am] = a.timed.split(" ")[0].split(":");
      const [bh, bm] = b.timed.split(" ")[0].split(":");

      return bh * 60 + bm - (ah * 60 + am);
    });
    renderData(sortThroughTime);
  }
}
function loadActiveTags() {
  bookmark.forEach((bookmark) => {
    bookmark.tags.forEach((tag) => {
      if (activeTags[tag]) {
        activeTags[tag] += 1;
      } else {
        if (activeTags[tag] == "") {
          return;
        }
        activeTags[tag] = 1;
      }
    });
  });
}

function counter(id) {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  let time = `${hours}:${minutes} ${ampm}`;

  const monthShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let months = now.getMonth();
  let todayDate = now.getDate();

  let t = bookmark.find((t) => t.id == id);
  t.timed = time;
  t.date = todayDate;
  t.month = monthShort[months];
  t.visited++;
  data();
  renderData(bookmark);
}
function renderData(bookmark) {
  let container = document.getElementById("book_container");
  let filtered =
    archivedItems == true
      ? bookmark.filter((t) => t.archived == true)
      : bookmark.filter((t) => t.archived == false);
  let title = document.getElementById("ts");
  title.innerHTML = archivedItems == true ? "All Archived" : "All Bookmarks";
  container.innerHTML = filtered
    .map(
      (t) => ` 
        <div class="bookmarks max-w-[320px] w-[100%] flex  flex-col justify-evenly mt-10 space-y-6">
            <div class="flex items-center justify-between">
                <div class="flex gap-3 items-center">
                    <div class="w-[50px] h-[50px] overflow-clip shadow-sm rounded-lg"><img class="h-full w-full object-cover object-center" src="${t.image}" alt=""></div>
                    <div class="flex flex-col">
                        <h1 class="text-xl">${t.title}</h1>
                        <a href="${t.url}" target="_blank" onclick="counter(${
        t.id
      })" class="text-[12px] truncate whitespace-nowrap max-w-[18ch] text-[#686D76]">${t.url}</a>
                    </div>
                </div>
                <div id="dotBtn"
                    class=" relative flex p-4 cursor-pointer items-center justify-center border-[1px] text-[#393E46] rounded-md h-[20px] w-[20px] border-solid border-[#8CA1A5]">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                    <div id="bookmark_toggles" class="absolute right-[110%]  gap-1 top-0 bg-[#03020204] backdrop-blur-[4px] w-[120px] rounded-sm hidden flex-col ">
                        <div onclick="pinItem(${t.id})" class="hover:bg-[#C4DFDF75] flex justify-center items-center"
                            >
                            <i class="fa-solid fa-thumbtack"></i><a class="block p-[3px] truncate text-[#31363F] w-22 text-[14px]  px-2 rounded-md " href="#">${
                              t.pinned === true ? "Unpin" : "Pin"
                            }</a>
                        </div>
                        <div
                            onclick="editItem(${t.id})" class="hover:bg-[#C4DFDF75] flex justify-center items-center"
                            >
                            <i class="fa-solid fa-pen-to-square"></i><a class="block p-[3px] truncate text-[#31363F] w-22 text-[14px]  px-2 rounded-md " href="#">Edit</a>
                        </div>
                        <div
                            onclick="delItem(${t.id})" class="hover:bg-[#C4DFDF75] flex justify-center items-center"
                            >
                            <i class="fa-solid fa-trash-can"></i><a class="block p-[3px] truncate text-[#31363F] w-22 text-[14px]  px-2 rounded-md " href="#">Delete</a>
                        </div>
                        <div
                            onclick="archivedItem(${t.id})" class="hover:bg-[#C4DFDF75] flex justify-center items-center"
                            >
                            <i class="fa-solid fa-box-archive"></i><a class="block p-[3px] truncate text-[#31363F] w-22 text-[14px]  px-2 rounded-md " href="#">${t.archived ? "UnArchived" : "Archived"}</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="h-[0.2rem] rounded-full w-[90%] mx-auto bg-[#8CA1A5]"></div>

            <div class="flex flex-col gap-y-3">
                <p class="text-sm text-ellipsis break-words line-clamp-4">${
                  t.description
                }</p>
                <div class="tags flex gap-3 text-[14px] flex-wrap">
                ${
                  t.tags
                    ? t.tags
                        .map(
                          (tag) => `  
                        <span
                            class="inline-block bg-[#D6E4E5] py-[1px]  min-w-[90px]  text-nowrap text-center rounded-sm px-2">${tag}</span>
                        `
                        )
                        .join("")
                    : ""
                }
                </div>
            </div>

            <div class="h-[0.2rem] rounded-full w-[100%] mx-auto bg-[#8CA1A5]"></div>

            <div class="flex justify-between text-[#3C4048] text-sm">
                <div class="flex gap-4 ">
                    <div class="flex gap-1 items-center justify-center"><i class="fa-regular fa-eye"></i><span>${
                      t.visited
                    }</span>
                    </div>
                    <div class="flex gap-1 items-center justify-center"><i class="fa-regular fa-clock"></i><span>${
                      t.timed
                    }</span></div>
                    <div class="flex gap-1 items-center justify-center"><i class="fa-regular fa-calendar"></i><span>${
                      t.date
                    } ${t.month}</span></div>
                </div>
                <div>
                    ${
                      t.pinned === true
                        ? `<i class="fa-solid fa-thumbtack"></i>`
                        : `<i class="fa-solid fa-thumbtack-slash"></i>`
                    }
                </div>
            </div>
        </div>`
    )
    .join("");

  if (bookmark.length == 0) {
    container.innerHTML = `<p class="text-center inline-block m-auto text-2xl text-gray-400">No bookmark is saved</p>`;
  }
  if(archivedItems && filtered){
    container.innerHTML = `No archived bookmarks!`
  }
  // loadActiveTags()
  const dots = document.querySelectorAll("#dotBtn");
  dots.forEach((dot) => {
    const menu = dot.querySelector("#bookmark_toggles");
    dot.addEventListener("click", () => {
      menu.classList.toggle("hidden");
      menu.classList.toggle("flex");
    });
  });

  loadActiveTags();
  renderTags();
  activeTags = {};
}

function pinItem(id) {
  const t = bookmark.find((u) => u.id === id);
if(t.pinned){
  t.pinned = !t.pinned
  delete t.dateAt
} else{
  t.pinned = !t.pinned
  t.dateAt = Date.now();
  
}
  activeTags = {};
  data();
  renderData(bookmark);

  renderPinItems();
}
function renderPinItems(){
  bookmark.sort((a, b) => {
    if(a.pinned && !b.pinned){
      return b.pinned - a.pinned;
    }
    if(a.dateAt && b.dateAt){
      return b.dateAt - a.dateAt;
    }
    return a.id - b.id
  })
  renderData(bookmark);
}
function archivedItem(id) {
  const t = bookmark.find((u) => u.id === id);
  t.archived = !t.archived;
  activeTags = {};
  data();
  renderData(bookmark);
}
archivedBtn.addEventListener("click", () => {
  // let allTab = document.querySelectorAll("[data-active]");
  // let currentTab = document.querySelector("[data-active='true']");
  // let index = Array.from(allTab).indexOf(currentTab);

  archivedItems = true;
  activeTags = {};
  data();
  renderData(bookmark);
});

unArchivedBtn.addEventListener("click", () => {
  archivedItems = false;
  activeTags = {};
  data();
  renderData(bookmark);
});

function delItem(id) {
  bookmark = bookmark.filter((t) => t.id != id);
  activeTags = {};
  loadActiveTags();
  renderTags();
  data();
  renderData(bookmark);
}

function saveData(id) {
  if (editingId) {
     if (tagInput.value.trim() !== "") {
        tagList.push(tagInput.value.trim());
    }
    let t = bookmark.find((t) => t.id == editingId);

    t.description = description.value;
    t.tags = tagList;
  } else {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    let time = `${hours}:${minutes} ${ampm}`;

    const monthShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let months = now.getMonth();
    let todayDate = now.getDate();

    let bookList = {
      id: Date.now(),
      url: feedingData.url,
      title: userInput.value,
      description: description.value,
      image: feedingData.image,
      date: todayDate,
      tags: tagList,
      month: monthShort[months],
      timed: time,
      visited: 0,
      pinned: false,
      archived: false,
    };

    bookmark.push(bookList);
  }
  tagList = [];
  activeTags = {};
  tag.innerHTML = "";
  editingId = false;
  data();
  renderData(bookmark);
  form.classList.add("hidden");
  form.classList.remove("flex");
  orginalForm.reset();
}

function editItem(id) {
  form.classList.remove("hidden");
  form.classList.add("flex");
  editingId = id;
  let editingItems = bookmark.find((t) => t.id == id);
  if (editingItems) {
    userInput.value = editingItems.title;
    description.value = editingItems.description;
    tagList = editingItems.tags;
    tag.innerHTML = tagList
      .map(
        (t) =>
          `<span class="inline-block px-4 py-[2px] text-center rounded-md text-white bg-[#3F7B70]">${t}</span>`
      )
      .join("");
  }
}

let searchingUrl;
userInput.addEventListener("change", () => {
  searchingUrl = userInput.value;
  fetchLink();
});


let url_1 = "https://api.linkpreview.net";
let apiKey = "4afde1e9975e407bb5df0ad342434f43";
let GEMINI_KEY = "AIzaSyDkUOTKYXtSL8ozCa1g6Vp4qOh7njHfDxU";
const fetchLink = async () => {
  console.log(searchingUrl);
  try {
    let res = await fetch(url_1, {
      method: "POST",
      headers: {
        "X-Linkpreview-Api-Key": apiKey,
      },
      mode: "cors",
      body: JSON.stringify({ q: searchingUrl }),
    });
    let data = await res.json();
    feedingData = data;
    userInput.value = feedingData.title;
    description.value = feedingData.description;
  } catch (err) {
    console.log(err);
  }
};

renderData(bookmark);
