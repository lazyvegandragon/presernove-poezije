// Fetch the JSON data
fetch('json/poems_w_groups.json')
    .then(response => response.json())
    .then(data => {
        // Save the poems data
        let poems = data;

        // Define the current sorting method
        let sortMethod = 'alphabetical';

        // Function to sort the poems alphabetically by title
        function sortAlphabetically() {
            poems.sort((a, b) => a.poem_title.localeCompare(b.poem_title));
        }

        // Function to sort the poems by group, subgroup, and inner number
        function sortByGroup() {
            poems.sort((a, b) => {
                return a.group_num - b.group_num || (a.subgroup_num - b.subgroup_num) || (a.poem_inner_num - b.poem_inner_num);
            });
        }

        // Sort the poems alphabetically by default
        sortAlphabetically();

        // Generate the poem links
        function generatePoemLinks() {
            let poemLinks = '';
            let currentGroup = null;
            let currentSubgroup = null;

            poems.forEach((poem, index) => {
                if (sortMethod === 'group') {
                    if (poem.poem_group && poem.poem_group !== currentGroup) {
                        poemLinks += `<h2>${poem.poem_group}</h2>`;
                        currentGroup = poem.poem_group;
                    }
                    if (poem.poem_subgroup && poem.poem_subgroup !== currentSubgroup) {
                        poemLinks += `<h3>${poem.poem_subgroup}</h3>`;
                        currentSubgroup = poem.poem_subgroup;
                    }
                }
                poemLinks += `<p><a href="#${index + 1}">${poem.poem_title}</a></p>`;
            });

            return poemLinks;
        }

        // Save the initial content of the main tag
        const main = document.querySelector('main');
        const initialMainContent = main.innerHTML;

        // Add the poem links to the main tag
        main.innerHTML += generatePoemLinks();

        // Function to display a poem
        function displayPoem(index) {
            if (index === 0) {
                main.innerHTML = initialMainContent;
                main.insertAdjacentHTML('beforeend', generatePoemLinks());
                document.querySelector('#sort-buttons').style.display = 'block'; // Show sort buttons
            } else {
                main.innerHTML = `<h3>${poems[index - 1].poem_title}</h3><p>` + poems[index - 1].poem_text.replace(/\n/g, '<br>') + '</p>';
                document.querySelector('#sort-buttons').style.display = 'none'; // Hide sort buttons
            }
            window.scrollTo(0, 0); // Scroll to the top
        }



        // Function to navigate to the previous poem
        function previousPoem() {
            let index = window.location.hash.slice(1);
            if (index === "") {
                index = poems.length; // If on landing page, go to the last poem
            } else {
                index = (index - 1 + poems.length + 1) % (poems.length + 1);
            }
            history.pushState(index, '', `#${index}`);
            displayPoem(index);
        }


        // Function to navigate to the next poem
        function nextPoem() {
            let index = window.location.hash.slice(1) ? (parseInt(window.location.hash.slice(1)) + 1) % (poems.length + 1) : 1;
            history.pushState(index, '', `#${index}`);
            displayPoem(index);
        }


        // Event listeners for the arrow buttons
        document.querySelector('#left-arrow').addEventListener('click', previousPoem);
        document.querySelector('#right-arrow').addEventListener('click', nextPoem);

        // Event listener for the sort button
        document.querySelector('#sort-buttons').addEventListener('click', function () {
            if (sortMethod === 'alphabetical') {
                sortByGroup();
                sortMethod = 'group';
            } else {
                sortAlphabetically();
                sortMethod = 'alphabetical';
            }
            // Regenerate the poem links and display the current poem again
            main.innerHTML = initialMainContent + generatePoemLinks();
            if (window.location.hash) {
                displayPoem(window.location.hash.slice(1));
            }
        });

        // Event listener for keyboard arrow keys
        window.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                previousPoem();
            } else if (event.key === 'ArrowRight') {
                nextPoem();
            }
        });

        // Event listener for the poem links
        main.addEventListener('click', event => {
            if (event.target.tagName === 'A') {
                let index = event.target.getAttribute('href').slice(1);
                history.pushState(index, '', `#${index}`);
                displayPoem(index);
                event.preventDefault();
            }
        });

        // Event listener for the popstate event
        window.addEventListener('popstate', event => {
            let index;
            if (event.state !== null) {
                index = event.state;
            } else if (window.location.hash) {
                index = window.location.hash.slice(1);
            } else {
                main.innerHTML = initialMainContent + generatePoemLinks();
                document.querySelector('#sort-buttons').style.display = 'block'; // Show sort buttons
                return;
            }
            displayPoem(index);
            document.querySelector('#sort-buttons').style.display = 'none'; // Hide sort buttons
        });

        // Check if there's a hash in the URL after the poems have been loaded
        if (window.location.hash) {
            displayPoem(window.location.hash.slice(1));
            document.querySelector('#sort-buttons').style.display = 'none'; // Hide sort buttons
        } else {
            document.querySelector('#sort-buttons').style.display = 'block'; // Show sort buttons
        }
    });

// Event listener for the home button
document.querySelector('#home').addEventListener('click', function () {
    window.location.href = '/presernove-poezije/';
});
