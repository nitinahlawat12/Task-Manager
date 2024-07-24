/* Opening and closing of data model start*/
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')
const delAll = document.querySelector('#deleteAll')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal);
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal);
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active');
  overlay.classList.add('active');
}
function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

/* Opening and closing of data model end*/

// Add Button Operation

let form = document.querySelector("form");
let main = document.querySelector(".main");

form.addEventListener("submit", (e) => {
  let imgURL = e.target.tImgurl.value;
  let title = e.target.tTitle.value;
  let desc = e.target.tDesc.value;
  let duedate = e.target.tDate.value;
  let category = e.target.tCategory.value;
  var checkStatus = 0;

  let taskData = JSON.parse(localStorage.getItem("taskDetails")) ?? [];
  for (let v of taskData) {
    if (v.title == title) {
      checkStatus = 1;
      break;
    }
  }
  const currentDate = new Date();
  if (checkStatus == 1) {
    alert("title Allready Exist");
  } else {
    if (new Date(duedate) >= currentDate){
    taskData.push({
      imgURL: imgURL,
      title: title,
      desc: desc,
      duedate: duedate,
      category: category,
      completed: false,
    });
    }
    else{
      alert("Please Enter the valid date");
    }
    
    localStorage.setItem("taskDetails", JSON.stringify(taskData));
    e.target.reset();
  }

  displayData();
  main.scrollTo({
    top: main.scrollHeight,
    behavior: "smooth"
  });

  e.preventDefault();
});

let displayData = () => {
  let taskData = JSON.parse(localStorage.getItem("taskDetails")) ?? [];

  let finalData = "";

  const currentDate = new Date();

  taskData.forEach((element, i) => {
    if (selectedCategory === 'all' || element.category.toLowerCase() === selectedCategory.toLowerCase()) {
      let containerClass = "task-container";
      let containerStyle = "width: 500px; height: auto; box-shadow: 20px 20px 20px 20px grey;padding: 10px;margin-bottom:45px;";
      if (new Date(element.duedate) < currentDate && !element.completed) {
        containerClass += " deadline-over";

        finalData += `<div class="${containerClass}" data-category="${element.category}" style="${containerStyle}">
        <h2 class="deadline-message" style="background:black;opacity:1;transform:rotate(325deg);">Deadline is Over</h2>
        <div style="opacity:0.5;">
        <h1>Task no.(${i + 1})</h1>
        <hr>
        <div style="display: flex;flex-wrap: wrap;flex-direction: row-reverse;gap: 10px;margin: 10px;">
            <button style="color: red; font-size: 20px;border-radius: 10px;padding: 10px;border-color: red;cursor: pointer;" onclick='removeData(${i})'><i class="fas fa-trash-alt"></i></button>
            <button style="color: green; font-size: 20px;border-radius: 10px;padding: 10px;border-color: green;cursor: pointer;" onclick={edit(${i})}><i class="fas fa-pencil-alt"></i></button>
          </div>
        <img src="${element.imgURL}" style="height:400px">
        <h3>Title:</h3>
        <p id="tTitle">${element.title}</p>
        <h3>Description</h3>
          <p id="desc">${element.desc}</p>
          <h3 style="display: inline;">Due Date:</h3>
          <p id="duedate" style="display: inline;">${element.duedate}</p>
          <button style="display: block;margin: 5px;font-weight: 600;background-color: beige;border-radius: 10px;">Category: <p>${element.category}</p></button>
          <button 
          style="background-color: ${element.completed ? "#7FFF00" : "#E6E6FA"};
          color: white; margin-left: 20px; border-radius: 10px" 
          ${element.completed ? "disabled" : ""}
          onclick="markAsComplete(${i})"
          ondblclick="toggleCompletion(${i})"
        >
          <i class="fa-solid fa-check" style="color: black; padding: 3px; font-size: 20px;"></i>
        </button>
          </div>
          </div>`;
      }
      else {
        if (element.completed) {
          containerClass += " completed";
        }
        finalData += `<div class="${containerClass}" data-category="${element.category}" style="${containerStyle}">
    <h1>Task no.(${i + 1})</h1>
    <hr>
    <div style="display: flex;flex-wrap: wrap;flex-direction: row-reverse;gap: 10px;margin: 10px;">
        <button style="color: red; font-size: 20px;border-radius: 10px;padding: 10px;border-color: red;cursor: pointer;" onclick='removeData(${i})'><i class="fas fa-trash-alt"></i></button>
        <button style="color: green; font-size: 20px;border-radius: 10px;padding: 10px;border-color: green;cursor: pointer;" onclick={edit(${i})}><i class="fas fa-pencil-alt"></i></button>
      </div>
    <img src="${element.imgURL}" style="height:400px">
    <h3>Title:</h3>
    <p id="tTitle">${element.title}</p>
    <h3>Description</h3>
      <p id="desc">${element.desc}</p>
      <h3 style="display: inline;">Due Date:</h3>
      <p id="duedate" style="display: inline;">${element.duedate}</p>
      <button style="display: block;margin: 5px;font-weight: 600;background-color: beige;border-radius: 10px;">Category: <p>${element.category}</p></button>
      <button 
      style="background-color: ${element.completed ? "#7FFF00" : "#E6E6FA"};
      color: white; margin-left: 20px; border-radius: 10px" 
      ${element.completed ? "disabled" : ""}
      onclick="markAsComplete(${i})"
      ondblclick="toggleCompletion(${i})"
    >
      <i class="fa-solid fa-check" style="color: black; padding: 3px; font-size: 20px;"></i>
    </button>

      </div>`;
      }
    }
  });

  main.innerHTML = finalData;
  updateCategoryButtons();
};

// Delete data by clicking on trash button
let removeData = (index) => {
  let taskData = JSON.parse(localStorage.getItem("taskDetails")) ?? [];
  taskData.splice(index, 1);

  localStorage.setItem("taskDetails", JSON.stringify(taskData));

  displayData();
};

//update & edit data by clicking on edit
function edit(id) {
  let taskData = JSON.parse(localStorage.getItem("taskDetails")) ?? [];
  document.querySelector('.update_form').style.display = "block";
  document.querySelector(".img").value = taskData[id].imgURL;
  document.querySelector(".tit").value = taskData[id].title;
  document.querySelector(".des").value = taskData[id].desc;
  document.querySelector(".dat").value = taskData[id].duedate;
  document.querySelector(".categ").value = taskData[id].category;
}

function update() {
  let taskData = JSON.parse(localStorage.getItem("taskDetails")) ?? [];
  let imgURL = document.querySelector(".img").value;
  let title = document.querySelector(".tit").value;
  let desc = document.querySelector(".des").value;
  let duedate = document.querySelector(".dat").value;
  let category = document.querySelector(".categ").value;

  var index = taskData.findIndex(rec => rec.title == title);
  taskData[index] = {
    imgURL,
    title,
    desc,
    duedate,
    category
  };

  localStorage.setItem("taskDetails", JSON.stringify(taskData));

  document.querySelector('.update_form').style.display = "none";

  displayData();
}

//Update function close

//closing the edit box

function closeEdit() {
  document.querySelector(".update_form").style.display = "none";
}
//closing the edit button end;

//markAsComplete button
function markAsComplete(index) {
  let taskData = JSON.parse(localStorage.getItem("taskDetails")) ?? [];
  taskData[index].completed = true;
  localStorage.setItem("taskDetails", JSON.stringify(taskData));
  // Get the task container and add the completed-animation class
  const taskContainers = document.querySelectorAll('.task-container');
  taskContainers[index].classList.add('completed-animation');
  

  // Display a congratulatory message for a short period
  const congratulationMessage = document.createElement('div');
  congratulationMessage.classList.add('congratulation-message');
  congratulationMessage.innerHTML = "Congratulations! You've completed this task!";
  taskContainers[index].appendChild(congratulationMessage);

  setTimeout(() => {
    // Remove the animation class and the congratulatory message
    taskContainers[index].classList.remove('completed-animation');
    taskContainers[index].removeChild(congratulationMessage);
    
    // Re-render the data to remove the completed animation
    displayData();
  }, 2000);
}

//mark as uncompleted
function toggleCompletion(index) {
  let taskData = JSON.parse(localStorage.getItem("taskDetails")) ?? [];
  taskData[index].completed = !taskData[index].completed;
  localStorage.setItem("taskDetails", JSON.stringify(taskData));
  displayData();
}

// Add a function to filter and display tasks based on the selected category
function filterTasks(category) {
  selectedCategory = category;
  displayData();
  updateCategoryButtons();
}

// Function to update category buttons styling
function updateCategoryButtons() {
  const buttons = document.querySelectorAll('.category-dropdown button');
  buttons.forEach(button => {
    if (button.textContent.toLowerCase() === selectedCategory) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

const categoryDropdown = document.querySelector('.category-dropdown');
let isCategoryDropdownOpen = false;
let categoryButton = document.querySelector('.categButton');
let selectedCategory = localStorage.getItem('selectedCategory') || 'all';

function toggleCategoryDropdown() {
  isCategoryDropdownOpen = !isCategoryDropdownOpen;
  categoryDropdown.style.display = isCategoryDropdownOpen ? 'block' : 'none';

  if(isCategoryDropdownOpen){
    categoryButton.innerHTML=`Category<i class="fa-solid fa-caret-down" style="color: #6f7785;margin-left:10px"></i>`;
  }
  else if(!isCategoryDropdownOpen){
    categoryButton.innerHTML=`Category<i class="fa-solid fa-caret-down" style="color: #6f7785;margin-left:10px;transform:rotate(-90deg)"></i>`;
  }
  // Close the category dropdown if open
  filterButton.innerHTML=`Filter<i class="fa-solid fa-caret-down" style="color: #6f7785;margin-left:10px;transform:rotate(-90deg)"></i>`;
  filterDropdown.style.display = 'none';
  isFilterDropdownOpen = false;
}


// Add a function to filter and display tasks based on the selected category
function filterTasks(category) {
  selectedCategory = category;
  displayData();
  updateCategoryButtons();
  toggleCategoryDropdown();
  localStorage.setItem('selectedCategory', category); // Store the selected category in local storage
}



// Update the filter category buttons based on the selected category
function updateCategoryButtons() {
  const categoryButtons = categoryDropdown.querySelectorAll('button');
  categoryButtons.forEach(button => {
    if (button.textContent.toLowerCase() === selectedCategory.toLowerCase()) {
      button.style.fontWeight = 'bold';
    } else {
      button.style.fontWeight = 'normal';
    }
  });
}

// Function to hide tasks that don't match the selected category
function hideTasksExcept(category) {
  const taskContainers = document.querySelectorAll('.task-container');
  taskContainers.forEach(container => {
    const taskCategory = container.getAttribute('data-category');
    if (category === 'all' || taskCategory === category) {
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  });
}

//filter function

const filterDropdown = document.querySelector('.filter-dropdown');
const filterButton = document.querySelector('.filter-button');
let isFilterDropdownOpen = false;

function toggleFilterDropdown() {
  isFilterDropdownOpen = !isFilterDropdownOpen;
  filterDropdown.style.display = isFilterDropdownOpen ? 'block' : 'none';
  if(isFilterDropdownOpen){
    filterButton.innerHTML=`Filter<i class="fa-solid fa-caret-down" style="color: #6f7785;margin-left:10px"></i>`;
  }
  else if(!isFilterDropdownOpen){
    filterButton.innerHTML=`Filter<i class="fa-solid fa-caret-down" style="color: #6f7785;margin-left:10px;transform:rotate(-90deg)"></i>`;
  }
  // Close the category dropdown if open
  categoryButton.innerHTML=`Category<i class="fa-solid fa-caret-down" style="color: #6f7785;margin-left:10px;transform:rotate(-90deg)"></i>`;
  categoryDropdown.style.display = 'none';
  isCategoryDropdownOpen = false;
}


// Function to sort tasks based on completion status and due date
function sortTasks(filterType) {
  let taskData = JSON.parse(localStorage.getItem("taskDetails")) ?? [];

  if (filterType === 'completed') {
    taskData.sort((a, b) => {
      return a.completed - b.completed || new Date(a.duedate) - new Date(b.duedate);
    });
  } else if (filterType === 'uncompleted') {
    taskData.sort((a, b) => {
      return b.completed - a.completed || new Date(a.duedate) - new Date(b.duedate);
    });

    toggleFilterDropdown();
  }

  localStorage.setItem("taskDetails", JSON.stringify(taskData));
  displayData();
}

//SearchTask implementation
function searchTasks() {
  toggleSearchInput();
  const searchTerm = document.querySelector('.searchInput').value.toLowerCase();
  const taskData = JSON.parse(localStorage.getItem("taskDetails")) ?? [];
  const matchingTasks = taskData.filter(task =>
    task.title.toLowerCase().includes(searchTerm) ||
    task.desc.toLowerCase().includes(searchTerm) ||
    task.category.toLowerCase().includes(searchTerm)
  );

  let finalData = "";
  const currentDate = new Date();
  matchingTasks.forEach((element, i) => {
    if (selectedCategory === 'all' || element.category.toLowerCase() === selectedCategory.toLowerCase()) {
      if (selectedCategory === 'all' || element.category.toLowerCase() === selectedCategory.toLowerCase()) {
        let containerClass = "task-container";
        let containerStyle = "width: 500px; height: auto; box-shadow: 20px 20px 20px 20px grey;padding: 10px;margin-bottom:45px";
        if (new Date(element.duedate) < currentDate && !element.completed) {
          containerClass += " deadline-over";

          finalData += `<div class="${containerClass}" data-category="${element.category}" style="${containerStyle}">
        <h2 class="deadline-message" style="background:black;opacity:1;transform:rotate(325deg);">Deadline is Over</h2>
        <div style="opacity:0.5;">
        <h1>Task no.(${i + 1})</h1>
        <hr>
        <div style="display: flex;flex-wrap: wrap;flex-direction: row-reverse;gap: 10px;margin: 10px;">
            <button style="color: red; font-size: 20px;border-radius: 10px;padding: 10px;border-color: red;cursor: pointer;" onclick='removeData(${i})'><i class="fas fa-trash-alt"></i></button>
            <button style="color: green; font-size: 20px;border-radius: 10px;padding: 10px;border-color: green;cursor: pointer;" onclick={edit(${i})}><i class="fas fa-pencil-alt"></i></button>
          </div>
        <img src="${element.imgURL}" style="height:400px">
        <h3>Title:</h3>
        <p id="tTitle">${element.title}</p>
        <h3>Description</h3>
          <p id="desc">${element.desc}</p>
          <h3 style="display: inline;">Due Date:</h3>
          <p id="duedate" style="display: inline;">${element.duedate}</p>
          <button style="display: block;margin: 5px;font-weight: 600;background-color: beige;border-radius: 10px;">Category: <p>${element.category}</p></button>
          <button 
          style="background-color: ${element.completed ? "#7FFF00" : "#E6E6FA"};
          color: white; margin-left: 20px; border-radius: 10px" 
          ${element.completed ? "disabled" : ""}
          onclick="markAsComplete(${i})"
          ondblclick="toggleCompletion(${i})"
        >
          <i class="fa-solid fa-check" style="color: black; padding: 3px; font-size: 20px;"></i>
        </button>
          </div>
          </div>`;
        }
        else {
          if (element.completed) {
            containerClass += " completed";
          }
          finalData += `<div class="${containerClass}" data-category="${element.category}" style="${containerStyle}">
    <h1>Task no.(${i + 1})</h1>
    <hr>
    <div style="display: flex;flex-wrap: wrap;flex-direction: row-reverse;gap: 10px;margin: 10px;">
        <button style="color: red; font-size: 20px;border-radius: 10px;padding: 10px;border-color: red;cursor: pointer;" onclick='removeData(${i})'><i class="fas fa-trash-alt"></i></button>
        <button style="color: green; font-size: 20px;border-radius: 10px;padding: 10px;border-color: green;cursor: pointer;" onclick={edit(${i})}><i class="fas fa-pencil-alt"></i></button>
      </div>
    <img src="${element.imgURL}" style="height:400px">
    <h3>Title:</h3>
    <p id="tTitle">${element.title}</p>
    <h3>Description</h3>
      <p id="desc">${element.desc}</p>
      <h3 style="display: inline;">Due Date:</h3>
      <p id="duedate" style="display: inline;">${element.duedate}</p>
      <button style="display: block;margin: 5px;font-weight: 600;background-color: beige;border-radius: 10px;">Category: <p>${element.category}</p></button>
      <button 
      style="background-color: ${element.completed ? "#7FFF00" : "#E6E6FA"};
      color: white; margin-left: 20px; border-radius: 10px" 
      ${element.completed ? "disabled" : ""}
      onclick="markAsComplete(${i})"
      ondblclick="toggleCompletion(${i})"
    >
      <i class="fa-solid fa-check" style="color: black; padding: 3px; font-size: 20px;"></i>
    </button>

      </div>`;
        }
      }
    }
  });

  main.innerHTML = finalData;
  updateCategoryButtons();

}


// Call hideTasksExcept initially to set the visibility based on the selected category
hideTasksExcept(selectedCategory);

displayData();

function toggleSearchInput() {
  const searchInput = document.querySelector('.searchInput');
  searchInput.classList.toggle('active');
  if (searchInput.classList.contains('active')) {
    searchInput.focus();
  } else {
    searchInput.blur();
  }
}

//Creating logic for delete all tasks

delAll.addEventListener("click", () => {
  let a = prompt("Are you sure to delete: Y/N");
  if(a=='Y'){
    alert("Data Deleted Successfully");
    localStorage.clear("taskDetails");
  }
  
  displayData();
})

//voice over
// Get the voice search button and search input field
const startVoiceSearchButton = document.getElementById("startVoiceSearch");
const searchInput = document.querySelector('.searchInput');

// Check if the browser supports the Web Speech API
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US'; // Set the language

    recognition.onstart = () => {
        startVoiceSearchButton.disabled = true;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript; // Set the spoken words as the input value
    };

    recognition.onend = () => {
        startVoiceSearchButton.disabled = false;
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim(); // Remove leading/trailing whitespace
      const cleanedTranscript = transcript.replace(/\.$/, ''); // Remove dot at the end
  
      searchInput.value = cleanedTranscript; // Set the cleaned transcript as the input value
  };

    startVoiceSearchButton.addEventListener("click", () => {
        recognition.start();
    });
} else {
    console.log("Sorry, your browser doesn't support the Web Speech API.");
}
