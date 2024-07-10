Product Name
Use a select element with an appropriate id attribute, name attribute, and set it to be required.
The first option in the select element is an instructional placeholder that says "Select a Product ..." and is disabled and selected so that it displays by default but cannot be clicked by the user.
The remaining options are created dynamically using a provided product array.
Each option must have a value attribute that is the product name.
A product array of objects is provided below to help you understand how to build a select field with the dynamic options. Normally the data would come from an external source.

Overall Rating
The overall product rating should have five levels (1 to 5) or stars.
The example form uses star entities ☆ (&star;) to display the level. You are free to employ a design of your choice. For example, here is another example of using stars that fill up on selection: Form Input Radio Star+ - CodePen.
Use a input of type radio for each of the levels.
The required attributes are an id, name (each of the radio buttons should have the same name value), and required.
