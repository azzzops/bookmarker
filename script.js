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
let tagList = [];
let activeTags = {};



// check if bookmark exist if it does render it on the page if not create a new array
let bookmark = JSON.parse(localStorage.getItem("bookmark")) || [],
  editingId = false;

let data = () => {
  localStorage.setItem("bookmark", JSON.stringify(bookmark));
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
    form.classList.add("hidden");
    form.classList.remove("flex");
  }
});

function renderTags(){
  
}
function loadActiveTags(){
  bookmark.forEach(bookmark => {
      bookmark.tags.forEach(tag => {
        if(activeTags[tag]){
          activeTags[tag] += 1;
        } else{
          activeTags[tag] = 1
        }
      })
  });
}
function renderData(bookmark) {
  let container = document.getElementById("book_container");
  container.innerHTML = bookmark.map(
    (t) =>
      ` <div class="bookmarks max-w-[320px] w-[100%] mt-10 space-y-6">
            <div class="flex gap-17 items-center justify-between">
                <div class="flex gap-3 items-center">
                    <div class="w-[35px] h-[35px] text-nowrap rounded-lg"><img src="${
                      t.img
                    }" alt=""></div>
                    <div class="flex flex-col">
                        <h1 class="text-xl">${t.title}</h1>
                        <a href="#" class="text-sm text-[#686D76]">${t.url}</a>
                    </div>
                </div>
                <div id="dotBtn"
                    class=" relative flex p-4 cursor-pointer items-center justify-center border-[1px] text-[#393E46] rounded-md h-[20px] w-[20px] border-solid border-[#8CA1A5]">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                    <div id="bookmark_toggles" class="absolute right-[110%] gap-1 top-0 bg-[#03020204] backdrop-blur-[4px] rounded-sm hidden flex-col ">
                        <div onclick="pinItem()"
                            class="flex gap-1 hover:bg-[#c4dfdf75] text-[#31363F] w-22 text-[14px] px-2 rounded-md justify-start items-center">
                            <i class="fa-solid fa-thumbtack"></i><a class="block" href="#">Pin</a>
                        </div>
                        <div
                            onclick="editItem(${t.id})"
                            class="flex gap-1 hover:bg-[#C4DFDF75] text-[#31363F] w-22 text-[14px]  px-2 rounded-md justify-start items-center">
                            <i class="fa-solid fa-pen-to-square"></i><a class="block" href="#">Edit</a>
                        </div>
                        <div
                            onclick="delItem(${t.id})"
                            class="flex gap-1 hover:bg-[#C4DFDF75] text-[#31363F] w-22 text-[14px]  px-2 rounded-md justify-start items-center">
                            <i class="fa-solid fa-trash-can"></i><a class="block" href="#">Delete</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="h-[3px] rounded-full w-[90%] mx-auto bg-[#8CA1A5]"></div>

            <div class="flex flex-col gap-y-3">
                <p class="text-sm">${t.description}</p>
                <div class="tags flex gap-3 text-[14px] flex-wrap">
                ${t.tags ? t.tags.map(
                  (tag) => `  
                        <span
                            class="inline-block bg-[#D6E4E5] py-[1px]  min-w-[90px]  text-nowrap text-center rounded-sm px-2">${tag}</span>
                        `
                ).join("") : ""}
                </div>
            </div>

            <div class="h-[3px] rounded-full w-[90%] mx-auto bg-[#8CA1A5]"></div>

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
                    ${t.pinned ? `<i class="fa-solid fa-thumbtack"></i>` : ""}
                </div>
            </div>
        </div>
        `
  ).join("");

  // loadActiveTags()
  //     let seee = ` <div class="bookmarks max-w-[320px] mt-10 space-y-6">
  //             <div class="flex gap-17 items-center justify-between">
  //                 <div class="flex gap-3 items-center">
  //                     <div class="w-[35px] h-[35px] text-nowrap rounded-lg bg-red-200"></div>
  //                     <div class="flex flex-col">
  //                         <h1 class="text-xl">Frontend Mentor</h1>
  //                         <a href="#" class="text-sm text-[#686D76]">frontendmentor.io</a>
  //                     </div>
  //                 </div>
  //                 <div id="dotBtn"
  //                     class=" relative flex p-4 cursor-pointer items-center justify-center border-[1px] text-[#393E46] rounded-md h-[20px] w-[20px] border-solid border-[#8CA1A5]">
  //                     <i class="fa-solid fa-ellipsis-vertical"></i>
  //                     <div id="bookmark_toggles" class="absolute right-[110%] gap-1 top-0 bg-[#03020204] backdrop-blur-[4px] rounded-sm hidden flex-col ">
  //                         <div
  //                             class="flex gap-1 hover:bg-[#c4dfdf75] text-[#31363F] w-22 text-[14px] px-2 rounded-md justify-start items-center">
  //                             <i class="fa-solid fa-thumbtack"></i><a class="block" href="#">Pin</a>
  //                         </div>
  //                         <div
  //                             class="flex gap-1 hover:bg-[#C4DFDF75] text-[#31363F] w-22 text-[14px]  px-2 rounded-md justify-start items-center">
  //                             <i class="fa-solid fa-pen-to-square"></i><a class="block" href="#">Edit</a>
  //                         </div>
  //                         <div
  //                             class="flex gap-1 hover:bg-[#C4DFDF75] text-[#31363F] w-22 text-[14px]  px-2 rounded-md justify-start items-center">
  //                             <i class="fa-solid fa-trash-can"></i><a class="block" href="#">Delete</a>
  //                         </div>
  //                     </div>
  //                 </div>
  //             </div>

  //             <div class="h-[3px] rounded-full w-[90%] mx-auto bg-[#8CA1A5]"></div>

  //             <div class="flex flex-col gap-y-3">
  //                 <p class="text-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates culpa pariatur
  //                     quae rerum esse
  //                     non
  //                     corrupti, nihil impedit repudiandae quam aliquam</p>
  //                 <div class="tags flex gap-3 text-[14px] flex-wrap">
  //                     <span
  //                         class="inline-block bg-[#D6E4E5] py-[1px]  min-w-[90px]  text-nowrap text-center rounded-sm px-2">Ai</span>
  //                     <span
  //                         class="inline-block bg-[#D6E4E5] py-[1px]  min-w-[90px] text-nowrap  text-center rounded-sm px-2">Learning</span>
  //                     <span
  //                         class="inline-block bg-[#D6E4E5] py-[1px]  min-w-[90px]  text-nowrap text-center rounded-sm px-2">practing</span>
  //                 </div>
  //             </div>

  //             <div class="h-[3px] rounded-full w-[90%] mx-auto bg-[#8CA1A5]"></div>

  //             <div class="flex justify-between text-[#3C4048] text-sm">
  //                 <div class="flex gap-4 ">
  //                     <div class="flex gap-1 items-center justify-center"><i class="fa-regular fa-eye"></i><span>30</span>
  //                     </div>
  //                     <div class="flex gap-1 items-center justify-center"><i class="fa-regular fa-clock"></i><span>Sep
  //                             30</span></div>
  //                     <div class="flex gap-1 items-center justify-center"><i class="fa-regular fa-calendar"></i><span>15
  //                             jan</span></div>
  //                 </div>
  //                 <div>
  //                     <i class="fa-solid fa-thumbtack"></i>
  //                 </div>
  //             </div>
  //         </div>
  // `;

  let threeDot = document.getElementById("dotBtn");
  let threeContent = document.getElementById("bookmark_toggles");

  threeDot.addEventListener("click", () => {
    if (threeContent.classList.contains("hidden")) {
      threeContent.classList.remove("hidden");
      threeContent.classList.add("flex");
    } else {
      threeContent.classList.add("hidden");
      threeContent.classList.remove("flex");
    }
  });
}

function delItem(id){
  bookmark = bookmark.filter(t => t.id != id);
}

function saveData(id) {

  if (editingId) {
    let t = bookmark.find(t => t.id == id);
    t.url = userInput.value;
    t.description = description.value;
    t.tags = tagList;
  } else{
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    let time = `${hours}:${minutes} ${ampm}`;

    const monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let months = now.getMonth();
    let todayDate = now.getDate();
    
    let bookList = {
      id: bookmark.length + 1,
      title: userInput.value,
      url: description.value,
      date: todayDate,
      tags: tagList,
      month: monthShort[months],
      timed: time,
      visited: 0,
      pinned: false
    }

  bookmark.push(bookList);
}
tagList = [];
data()
renderData(bookmark)
form.classList.add("hidden");
form.classList.remove("flex");
orginalForm.reset();
}

function editItem(id) {
 form.classList.remove("hidden");
  form.classList.add("flex");
  editingId = id;
  let editingItems = bookmark.find((t) => (t.id == id));
  if (editingItems) {
    userInput.value = editingItems.url;
    description.value = editingItems.description;
    tagList = editingItems.tags
    tag.innerHTML = editingItems.tag.map(
      (t) =>
        `<span class="inline-block px-4 py-[2px] text-center rounded-md text-white bg-[#3F7B70]">${t}</span>`
    );
  }
}


// const fetchLink = async () => {
//   let searchLink = { q: userInput };
//   let url_1 = "https://api.linkpreview.net";
//   let apiKey = "4afde1e9975e407bb5df0ad342434f43";
//   let GEMINI_KEY = "AIzaSyDkUOTKYXtSL8ozCa1g6Vp4qOh7njHfDxU";
//   let header = {
//     method: "POST",
//     headers: {
//       "X-Linkpreview-Api-Key": apiKey,
//     },
//     mode: "cors",
//     body: JSON.stringify(searchLink),
//   };

//   let res = await fetch(url_1, header);
//   let data = await res.json();

//   const { description, image, title, url } = data;
//   console.log(aiData);
// };
