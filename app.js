const search = document.getElementById('search');
const submit = document.getElementById('submit');
const mealssearch = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_meal = document.getElementById('single-meal');


function searchMeal(e) {
    e.preventDefault();


    single_meal.innerHTML = ' ';


    const term = search.value;
    console.log(term);


    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                resultHeading.innerHTML = `<h2>Search results for "${term}":</h2>`;

                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>There are no meals for that search term. Try Again</p>`
                    mealssearch.innerHTML = `<div class = "">
                    <img/>
                    <div data-mealID ="">
                        <h3></h3>
                    </div> 
                </div>`
                } else {
                    resultHeading.innerHTML = `<p>Click the image to get the recipe</p>`
                    mealssearch.innerHTML = data.meals.map(meal => `<div class = "meal">
                    <img src = "${meal.strMealThumb}" alt = "${meal.strMeal}"/>
                    <div class ="meal-info" data-mealID ="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div> 
                </div>`).join('');
                }
            });

        search.value = ' ';
    } else {
        resultHeading.innerHTML = `<p>Please enter search value</p>`
        mealssearch.innerHTML = `<div class = "">
                    <img/>
                    <div data-mealID ="">
                        <h3></h3>
                    </div> 
                </div>`
    }
}


function getMealById(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
}

function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}`)
        } else {
            break;
        }
    }
    single_meal.innerHTML = `<div class = "single-meal">
        <h1>${meal.strMeal}</h1>
        <img src = "${meal.strMealThumb}" alt ="${meal.strMeal}"/>
        <div class = "single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</P>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</P>` : ''}
        </div>
        <div class = "main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
            ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    </div>`
}


submit.addEventListener('submit', searchMeal);


mealssearch.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealId = mealInfo.getAttribute('data-mealid');
        getMealById(mealId);
    }
})