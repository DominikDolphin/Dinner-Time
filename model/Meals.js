const MealsDB = {

    Meals: [],

    initDB() {
        this.Meals.push({
            Name: "Keto Package",
            price: 59.99,
            image: "keto.jpg",
            description: "High fat, low carb meals with moderate protein to achieve and sustain ketosis",
            featured: true
        });

        this.Meals.push({
            Name: "Gluten Free Package",
            price: 64.99,
            image: "gluten.jpg",
            description: "A gluten-free package with the same balanced profile as our other packages",
            featured: true
        });

        this.Meals.push({
            Name: "Vegan Package",
            price: 64.99,
            image: "vegan.jpg",
            description: "A fully plant-based package featuring vegan meat and no animal products",
            featured: true
        });

        this.Meals.push({
            Name: "Muscle Gain Package",
            price: 69.97,
            image: "muscle.jpg",
            description: "Higher protein and calorie portions to support your muscle gain momentum",
            featured: true
        });
    },

    getAllMeals() {
        return this.Meals;
    },

    getFeaturedMeals(amount = -1) {
        let toReturn = [];
        let count = 0;
        //If user does not add a parameter of how many meals to display,
        //Automatically return all featured packages.
        if (amount == -1) {
            this.Meals.forEach(option => {
                if (option.featured == true)
                    toReturn.push(option);
            })
        } else {
            this.Meals.forEach(option => {
                if (count < amount) {
                    if (option.featured == true) {
                        toReturn.push(option);
                        count++
                    }
                }
            })
        }
        return toReturn;
    }


}

MealsDB.initDB();
module.exports = MealsDB;