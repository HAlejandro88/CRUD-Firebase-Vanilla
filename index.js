
const db = firebase.firestore();

const taskForm = document.querySelector('#task-form');
const taskcontainer = document.querySelector('#tasks-conteiner');

let ediStatus = false;
let idF = '';

const createtask = (title, description) => {
    db.collection('tasks').doc().set({
        title,
        description
    });
}

const getTask = () => db.collection('tasks').get();

const getTaskById = id => db.collection('tasks').doc(id).get();

const onGetTask = cb => db.collection('tasks').onSnapshot(cb);

const deleteTask = id => db.collection('tasks').doc(id).delete();

const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask)

window.addEventListener('DOMContentLoaded', async(e) => {
    onGetTask(querySnapshot => {
        taskcontainer.innerHTML = '';
        querySnapshot.forEach(doc => {
            console.log(doc.data());
            const task = doc.data();
            const {title, description} = doc.data();
            task.id = doc.id;
            taskcontainer.innerHTML += `<div class="card card-body mt-2 border-warning">
                <h3 class="h5">${title}</h3>
                <p>${description}</p>
                <div>
                    <button class="btn btn-danger btn-delete" data-id="${task.id}">Delete</button>
                    <button class="btn btn-secondary btn-edit" data-id="${task.id}">Edit</button>
                </div>
            </div>`;

            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(bton => {
                bton.addEventListener('click', async(e) => await deleteTask(e.target.dataset.id))
            });

            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(boton => {
                boton.addEventListener('click', async(e) => {
                    const docOne = await getTaskById(e.target.dataset.id);
                    let {title, description} = docOne.data();
                    ediStatus = true;
                    idF = task.id;
                    taskForm['task-title'].value = title;
                    taskForm['task-description'].value = description;
                    taskForm['btn-task-form'].innerText = 'Update'
                })
            })
        });
    })
    
})

taskForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    let title = taskForm['task-title'];
    let description = taskForm['task-description'];

    if (!ediStatus) {
        await createtask(title.value, description.value);
    } else {
        await updateTask(idF, { title: title.value, description: description.value });
        ediStatus = false;
        idF = '';
        taskForm['btn-task-form'].innerText = 'Save';
    }
    taskForm.reset();
    title.focus();
})