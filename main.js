const PRODUCT_API = "http://localhost:9000/product";
let inpurl = document.querySelector(".inpurl");
let inptext = document.querySelector(".inptext");
let inpnum = document.querySelector(".inpnum");
let add = document.querySelector(".add");
let card = document.querySelector(".card");
let btnUpdate = document.querySelector(".update");
add.addEventListener("click", () => btnModal.click());
add.addEventListener("click", addPush);
async function addPush(e) {
  e.preventDefault();
  let Obj = {
    image: inpurl.value,
    title: inptext.value,
    num: inpnum.value,
  };
  //  console.log(Obj);

  fetch(PRODUCT_API, {
    method: "POST",
    body: JSON.stringify(Obj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  inptext.value = "";
  inpnum.value = "";
  inpurl.value = "";
  render();
}
let currentPage = 1;
let search = "";
let category = "";

async function render(search = "") {
  card.innerHTML = "";
  let res = await fetch(`
    ${PRODUCT_API}?q=${search}&_page=${currentPage}&_limit=4
  `);
  let data = await res.json();
  data.forEach(item => {
    card.innerHTML += `
<div class="card m-5 bg-light" style="width: 18rem;">
        <img src="${item.image}" class="card-img-top" alt="...">
                 <div class="card-body">
                <p class="card-text">${item.title}</p>
                <p class="card-text">${item.num}</p>
                <a href="#" class="btn btn-info btn-delete" id="${item.id}">DELETE</a>
                <a href="#" class="btn btn-dark btn-update " id="${item.id}">update</a>
            </div>
        </div>`;
    addDelete();
    addEditEvent();
  });
}
// delete
render();
async function deleteProduct(e) {
  let productId = e.target.id;

  await fetch(`${PRODUCT_API}/${productId}`, {
    method: "DELETE",
  });

  render();
}

function addDelete() {
  let deleteProductBtn = document.querySelectorAll(".btn-delete");
  deleteProductBtn.forEach(item => {
    item.addEventListener("click", deleteProduct);
  });
}

// update
async function update(e) {
  let productId = e.target.id;
  let res = await fetch(`${PRODUCT_API}/${productId}`);
  let productObj = await res.json();
  btnUpdate.id = productObj.id;
  //   btnUpdate.setAttribute('id', productObj.id);
  inptext.value = productObj.title;
  inpnum.value = productObj.num;
  inpurl.value = productObj.image;
}
console.log();
let btnModal = document.querySelector(".btn-modal");
function addEditEvent() {
  let btnEditProduct = document.querySelectorAll(".btn-update");
  btnEditProduct.forEach(item => {
    item.addEventListener("click", update);
  });

  btnEditProduct.forEach(item => {
    item.addEventListener("click", () => {
      btnModal.click();
      add.style.display = "none";
      btnUpdate.style.display = "block";
    });
  });
}
btnModal.addEventListener("click", () => {
  btnUpdate.style.display = "none";
  add.style.display = "block";
});
async function saveChanges(e) {
  let updatedProductObj = {
    id: e.target.id,
    image: inpurl.value,
    title: inptext.value,
    num: inpnum.value,
  };
  await fetch(`${PRODUCT_API}/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify(updatedProductObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  inpnum.value = "";
  inptext.value = "";
  inpurl.value = "";

  render();
}
let btnclose = document.querySelector(".btnCloser");
btnUpdate.addEventListener("click", saveChanges);
btnUpdate.addEventListener("click", () => {
  btnclose.click();
});
let searchbtn = document.querySelector(".search-inp");
searchbtn.addEventListener("input", e => {
  render(e.target.value.toLowerCase());
});

let nextPage = document.querySelector("#next-page");
let prevPage = document.querySelector("#prev-page");

async function checkPages() {
  let res = await fetch(PRODUCT_API);
  let data = await res.json();
  let pages = Math.ceil(data.length / 3);
  if (currentPage === 1) {
    prevPage.style.display = "none";
    nextPage.style.display = "block";
  } else if (currentPage === pages) {
    prevPage.style.display = "block";
    nextPage.style.display = "none";
  } else {
    prevPage.style.display = "block";
    nextPage.style.display = "block";
  }
}
checkPages();

nextPage.addEventListener("click", () => {
  currentPage++;
  render();
  checkPages();
});

prevPage.addEventListener("click", () => {
  currentPage--;
  render();
  checkPages();
});
