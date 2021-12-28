import {  Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{
    recipesChanged = new Subject<Recipe[]>();

    // private recipes : Recipe[] = 
    //   [
    //     new Recipe('Tasty schnitzel',
    //     'A super tasy schnitzel !!',
    //     'https://p1.pxfuel.com/preview/923/341/139/cordon-bleu-french-fries-eat-lunch-french-schnitzel.jpg',
    //     [ new Ingredient('Meat',1),
    //      new Ingredient('French Fries',50)]),
    //     new Recipe('Big fat burger',
    //     'What else do you need to say?',
    //     'https://p1.pxfuel.com/preview/753/541/259/beef-bread-bun-burger.jpg',
    //     [ new Ingredient('Buns',2),
    //     new Ingredient('Patty',1),
    //     new Ingredient('French Fries',50)])
    //   ];

    private recipes :Recipe[] = [];

      constructor(private shoppingListService:ShoppingListService){

      }

      setRecipes(recipes:Recipe[]){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
      }
      

      getRecipe(index:number){
          return this.recipes[index];
      }

      getRecipes(){
          return this.recipes.slice();
      }

      addIngredientToShoppingList(ingredients:Ingredient[]){
            this.shoppingListService.addIngredients(ingredients);
      }

      addRecipe(recipe:Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index : number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
      }

      deleteRecipe(index:number){
        this.recipes.splice(index,1);
        this.recipesChanged.next(this.recipes.slice())
      }
}