function findWeaknesses(name) {

    let weaknesses = ['Weakness 1', 'Weakness 2', 'Weakness 3', 'Weakness 4', 'Weakness 5'];

    weaknesses.forEach(weakness => {
        const listItem = document.createElement('li');
        listItem.textContent = weakness;
        document.getElementById('weaknesses').appendChild(listItem);
    })
}