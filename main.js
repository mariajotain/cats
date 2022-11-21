// mariajotain
// baseUrl = http://sb-cats.herokuapp.com/api/2/mariajotain/

const $openModalBtn = document.querySelector("[data-open_modal]"); /*Получаем кнопку Добавить со страницы*/
const $closeModalBtn = document.querySelector("[data-close_modal]"); /*Получаем кнопку Закрыть со страницы*/
const $wr = document.querySelector("[data-wr]"); /*Получаем див, где будут создаваться карточки, со страницы*/
const $modalsWr = document.querySelector("[data-modals_wr]"); /*Получаем див с модальным окном для кнопки Добавить*/
const $modalsSh = document.querySelector("[data-modals_sh]"); /*Получаем див с модальным окном для кнопки Подробнее*/
const $modalsShCard = document.querySelector("[data-modal_show_card]"); /*Получаем див с модальным окном для кнопки Подробнее*/
const $closeShowBtn = document.querySelector("[data-close_show_btn]"); /*Получаем кнопку Закрыть со страницы*/

// Создаем функцию, которая будет генерировать карточку, при получении данных из АПИ
const generateCardHTML = (cat) => {
    return `
    <div data-card_id=${cat.id} class="card my-2" style="width: 18rem;">
        <img src="${cat.img_link}" class="card-img-top" alt="${cat.name}">
        <div class="card-body">
        <h5 class="card-title">${cat.name}</h5>
        <p class="card-text">Рейтинг: ${cat.rate} из 10</p>
        <p class="card-text">Возраст: ${cat.age} лет </p>
        <div class="btn_flex">
        <button data-action="show" class="btn btn-dark btn-sm">Подробнее</button>
        <button data-action="delete" class="btn btn-danger btn-sm">Удалить</button>
        </div>
        </div>
    </div>

    `;
};

const generateModalHTML = (cat) => {
    return `
    <div data-card_id=${cat.id} class="card my-2" style="width: 18rem;">
    <img src="${cat.img_link}" class="card-img-top" alt="${cat.name}">
    <div class="card-body">
    <h5 class="card-title">${cat.name}</h5>
    <p class="card-text">Рейтинг: ${cat.rate} из 10</p>
    <p class="card-text">Возраст: ${cat.age} лет </p>
    <p class="card-text">${cat.description}</p>
    </div>
</div>
`;
};


// Запросы из АПИ

class API {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
// Получить всех котов
    async getAllCats() {
        const response = await fetch(`${this.baseURL}/show`);
        const data = await response.json();
        return data;
    }
    // Удалить кота
    async deleteCat(catId) {
        try {
            const response = await fetch(`${this.baseURL}/delete/${catId}`, {
                method:"DELETE",
            });
            console.log(`${this.baseURL}/delele/${catId}`);
            console.log(response);
            if (response.status !== 200 ) {
                throw new Error();
            }
        } catch (error) {
            
        }
    }



// Получить одного кота
    async getOneCat(catId) {
        const response = await fetch(`${this.baseURL}/show/${catId}`);
        const dataOneCat = await response.json();
        return dataOneCat;

    }

//   Добавить кота
    async addCat(data) {
        try {
            const response = await fetch(`${this.baseURL}/add`, {
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            });
            if (response.status !== 200 ) {
                throw new Error();
            }
        } catch (error) {
            
        }

    }

// Изменить кота 

async editOneCat(catId, data) {
    
    try {
        const response = await fetch(`${this.baseURL}/update/${catId}`, {
            method:"PUT",
            headers: {
                'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        });
        if (response.status !== 200 ) {
            throw new Error();
        }
    } catch (error) {
        
    }

}


}

// Обращаемся к АПИ
const api = new API("https://sb-cats.herokuapp.com/api/2/mariajotain");

// Генерируем карточки на странице

api.getAllCats().then((responseFromBackend) => {
    responseFromBackend.data.forEach((cat) => $wr.insertAdjacentHTML("beforeend", generateCardHTML(cat)));
}).catch(() => {});



// Вешаем обработчик, если нажата кнопка 
$wr.addEventListener("click", (event) => {
    switch (event.target.dataset.action) {
        case 'delete': {
            const $cardWr = event.target.closest("[data-card_id]"); /*обращаемся к event-target, метод  closest позволяет искать ближайшего родителя для которого совпадут условия, снизу вверх идет */
            const catId = $cardWr.dataset.card_id;
            api.deleteCat(catId).then(() => {
            $cardWr.remove();
        }).catch(() => {});
        break;
    }
    case 'show': {
        const $cardWr = event.target.closest("[data-card_id]");
        const catId = $cardWr.dataset.card_id;
        api.getOneCat(catId).then((response) => {
            $modalsShCard.insertAdjacentHTML("beforeend", generateModalHTML(response.data));
            $modalsSh.classList.remove('hidden');
        }).catch(() => {});


        break;
    }
    
        default:

            break;
    }
});

// $modalsShCard.addEventListener("submit", (event) => {
//     switch (event.target.dataset.action) {
//         case 'edit': {
//             event.preventDefault();
//             const $cardWr = event.target.closest("[data-card_id]"); /*обращаемся к event-target, метод  closest позволяет искать ближайшего родителя для которого совпадут условия, снизу вверх идет */
//             const catId = $cardWr.dataset.card_id;
//             console.log(catId);
//             api.editOneCat(catId).then(() => {
     
//         }).catch(() => {});
//         $modalsSh.classList.add('hidden');
//         break;
//     }
    
//         default:
//             break;
//     }
// });
// document.forms.edit_cat

// Работа формы в кнопке Изменить
$modalsShCard.addEventListener('submit', (event) => {
    const $cardWr = event.target.parentNode.lastElementChild;
    const catId = $cardWr.dataset.card_id;
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.rate = Number(data.rate);
    data.age = Number(data.age);
    data.favourite = data.favourite == 'on';
    for (let key in data) {
        if (data[key] === 0 || data[key] === "") {delete data[key];}
    }
    api.editOneCat(catId,data).then(() => {
        $wr.insertAdjacentHTML("beforeend", generateCardHTML(data));
        $modalsSh.classList.add('hidden');
        event.target.reset(); /* очищение формы*/ 
    }).catch(alert);
   
});

// Работа формы в кнопке Добавить
document.forms.add_cat.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.id = Number(data.id);
    data.rate = Number(data.rate);
    data.age = Number(data.age);
    data.favourite = data.favourite == 'on';
    api.addCat(data).then(() => {
        $wr.insertAdjacentHTML("beforeend", generateCardHTML(data));
        $modalsWr.classList.add('hidden');
        event.target.reset(); /* очищение формы*/ 
    }).catch(alert);
});

// При нажатой кнопке Добавить, показать модальное окно
$openModalBtn.addEventListener('click', () => {
    $modalsWr.classList.remove('hidden');
});

// При нажатой кнопке закрыть, убрать модальное окно кнопки Добавить
$closeModalBtn.addEventListener('click', () => {
    $modalsWr.classList.add('hidden');
});

$closeShowBtn.addEventListener('click', () => {
    $modalsSh.classList.add('hidden');
});

const $nameForm = document.forms.add_cat.name;
const rawFormDataFromLS = localStorage.getItem(document.forms.add_cat.name);
const formDataFromLS = rawFormDataFromLS ? JSON.parse(rawFormDataFromLS) : undefined;

if (formDataFromLS) {
	Object.keys(formDataFromLS).forEach(key => {
		document.forms.add_cat[key].value = formDataFromLS[key];	
	});
}


document.forms.add_cat.addEventListener('input', (e) => {
	const formDataObj = Object.fromEntries(new FormData(document.forms.add_cat).entries());
	console.log({formDataObj});
	localStorage.setItem(document.forms.add_cat.name, JSON.stringify(formDataObj));
});
// {
//     "id": 9,
//     "age": 10,
//     "name":"Короткошерстный ориентал",
//     "rate": 7,
//     "description":"Ориентальная кошка, с первого взгляда, впечатляет своими ушами (по сравнению с телом и головой, они кажутся просто огромными). Это прекрасный друг и предавать его нельзя (кошка не поймет, если вы отдадите её другому человеку).",
//     "favourite":true,
//     "img_link":"https://cattish.ru/wp-content/uploads/2018/06/oriental-shorthair-3-678x509.jpg"
//     }
// JSON.stringify({
//     id: 1,
//     age: 8,
//     name: "Мейн-кун",
//     rate: 5,
//     description: "Одной из самых удивительных и загадочных пород считается мейн-кун – ласковый гигант с серьезным взглядом. Этих созданий называют «комнатными рысями», что неудивительно, т.к. они одни из самых крупных домашних кошек",
//     favourite: true,
//     img_link: "https://cattish.ru/wp-content/uploads/2018/04/mc-1-678x509.jpg",
//   });

  

// <name> - ваше уникальное имя. Советуем использовать nickname из github (строчные латинские буквы).

// <id кота> - порядковый номер кота в базе данных (число).


// __________________________________

// Описание API


// GET - получить информацию обо всех котах

//     http://sb-cats.herokuapp.com/api/2/<name>/show



// GET - получить массив всех существующих id

//     http://sb-cats.herokuapp.com/api/2/<name>/ids



// GET - получить информацию об одном котике по id

//     http://sb-cats.herokuapp.com/api/2/<name>/show/<id кота>



// POST - добавить нового кота (id, name - обязательно!)

//     http://sb-cats.herokuapp.com/api/2/<name>/add
// Тело запроса может включать следующие поля:
// id (обязательное поле) — число
// age — число
// name (обязательное поле) — строка
// rate — число от 1 до 10
// description — строка
// favourite — логическое значение true или false
// img_link — строка. Ссылка на картинку
// document.forms.nameForm.addEventListener("submit", (event) => {

  