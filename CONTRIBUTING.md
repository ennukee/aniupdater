# Contribution Guidelines

First of all, thank you for considering contributing to this project. I appreciate any help in making this project a better experience.

However, there are certain guidelines that I ask contributors to adhere to.

### What we're looking for

Most things, honestly. There's very little we're against including but note there are some preconditions for some of the stuff you may want to contribute

### Ground rules

 * If you plan to add a new feature, ensure that you have created (or that there exists already) a ticket that is marked as a feature request. That ticket should be read over and approved one of the maintainers before you consider implementing it. **It is not unreasonable for myself or a maintainer to turn down a PR if it's for a feature we haven't approved of yet.** 
 * Any large scale feature requests will require heavy collaboration with the original author (@ennukee) as it will often require big changes (e.g. localization support) that should be supervised to ensure that everything matches up with how we envision it to be.
 * If your ticket is minor (e.g. typo, slight styling fix) feel free to just open a PR without a ticket.

### Style guide

Please have an ESLint plugin installed for your editor of choice and use the `.eslintrc` file provided in the repository.

### File Structure

We are aiming to maintain a fairly consistent file structure in this repo. You'll probably catch on as you see it, but here's the formal documentation.

 * Each module must have its own folder named exactly as the module JS file is. (e.g. MyModule/MyModule.js). Each module folder will contain the following:
   * **`util/`** -- A folder that holds any utility files (**not** react components, standalone convenience functions abstracted out for easier testing or reuse. You can put custom hooks here.) -- **optional directory** (not all components have utils)
     * In this file, you will have any number of `.js` files and a `__tests__` folder that contains the test for all of the `.js` files.
   * **`submodules/`** -- A folder that holds all react components that are used exclusively within this module (if usable by many, bring to a higher level in file structure). Contains any number of module folders like being described here -- **optional directory** (lowest level components don't have subcomponents)
   * **`MyModule.js`** -- React component file, pretty self explanatory.
   * **`MyModule.test.js`** -- A Jest/RTL file that tests the react component. Note **this is a mandatory file**, all components must be fully tested.
   * **`MyModule.css`** -- Any styling specific to this module must go here. You **should not import CSS files other than this one** in your respective component.