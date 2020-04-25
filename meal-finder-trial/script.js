const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

async function searchMeal(e) {
  e.preventDefault();

  // Clear single meaal
  single_mealEl.innerHTML = "";

  const term = search.value;

  if (term.trim()) {
    const data = await (
      await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
      )
    ).json();
    resultHeading.innerHTML = `<h2>Search results for '${term}'</h2>`;

    if (data.meals === null) {
      resultHeading.innerHTML = `<p>There are no search Result</p>`;
    } else {
      mealsEl.innerHTML = data.meals.map(
        (meal) => `
            <div class = "meal">
             <img src ="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class = "meal-info" data-mealID="${meal.idMeal}"> 
                <h3> ${meal.strMeal} </h3>
            </div>
            </div>
            `
      ).join('');
    }
    search.value = ''
  } else {
    alert("please enter a search term");
  }
}

async function getMealById(mealID) {
    const data = await (await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`) ).json()
    const meal = data.meals[0];

    addMealToDOM(meal);

}

function addMealToDOM(meal) {
    const ingredients = [];

    for(let i= 1; i <= 20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]} `)
        }else{
            break;
        }
    }

    single_mealEl.innerHTML = `
        <div class="single-meal"> 
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class ="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>

            </div>
        </div>
    `
}

submit.addEventListener("submit", searchMeal);

mealsEl.addEventListener('click', e=>{
    const mealInfo = e.path.find(item=>{
        if(item.classList) {
            return item.classList.contains('meal-info');
        }else{
            return false
        }
    });

    if(mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
    

})
