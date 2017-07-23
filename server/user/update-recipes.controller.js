const mongoose = require('mongoose');
const User = require('./user.model');
const NEW_RECIPE_STATUS = 3;

// recipes: { legacy: Recipe, newRecipe: Recipe }[]
function updateRecipes(user, changes) {
  const idsMap = changes.map(change => {
    const legacy = change.legacy;
    const newRecipe = change.newRecipe;
    let userRecipe;
    if (legacy.status !== NEW_RECIPE_STATUS) {
      userRecipe = user.recipes.id(legacy.id);
    } else {
      user.recipes.push({ recipe: {}, queries: [] });
      userRecipe = user.recipes[user.recipes.length - 1];
    }
    if (newRecipe) {
      mergeNewRecipe(userRecipe, newRecipe);
    } else {
      userRecipe.remove();
    }
    return { legacy: legacy.id, newId: userRecipe ? userRecipe._id : undefined }
  });
  return user.save().then(() => idsMap);
}

function mergeNewRecipe(userRecipe, newRecipe) {
  Object.assign(userRecipe.recipe, newRecipe);
  userRecipe.markModified('recipe');
  return userRecipe;
}

module.exports = (options) => {
  return (req, res, next) => {
    User.findByToken(req.body.user_token)
      .then(user => updateRecipes(user, req.body.recipes))
      .then(idsMap => res.json({ ids: idsMap }))
      .catch(e => next(e));
  }
}
