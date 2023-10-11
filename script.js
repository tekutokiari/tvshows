const query_url = 'https://api.tvmaze.com/search/__QUERY__?q=__INPUT__';
const trending = query_url.replace('__QUERY__', 'shows').replace('__INPUT__', 'the');
const resultList = document.querySelector("#results");
const trendList = document.querySelector("#trend");

function getInputValue()
{
    let input = document.getElementById('tsearch').value;
    let option = document.getElementById('query').options[document.getElementById('query').selectedIndex].text;
    cls = "col-sm-3";
    let screenwidth = window.innerWidth;
    if(screenwidth >= 580 && screenwidth <= 768)
        cls = "col-sm-6";
    if(option == 'TV Shows')
        query = 'shows';
    else
        query = 'people';
    if(onlySpaces(input))
        return clearWebsite();
    input = input.replaceAll(' ', '%20'); //for fetch to correctly get the url not cutting off at the first space but replacing spaces with '%20' in unicode
    url = query_url.replace('__QUERY__', query).replace('__INPUT__', input);
    fetch(url).then((response) => response.json()).then((data) => 
    {
        if(data == ''){
            document.getElementById('response-text').innerHTML = 'No results found';
        }
        else{
            document.getElementById('response-text').innerHTML = '';
        }
        for(const element of data)
        {
            if(query == 'shows')
            {
                rating = '';
                if(element.show.rating.average != null)
                    rating = `Rating:${element.show.rating.average}`;
                if(element.show.image == null){
                    console.log('aa');
                }
                if(element.show.url != undefined && element.show.image != null)
                {
                    resultList.insertAdjacentHTML('beforeend',
                    `<div id='rsizer' class="${cls} p-4">
                        <div class="movies">
                            <div class="imgdivwrap" style="max-height:300px;max-width:200px;">
                                <a href="${element.show.url}" target="_blank">
                                    <img style="width:200px;height:300px;display:block;" src="${element.show.image.original}" alt="movie card">
                                    <div class="overlay">
                                        Title:${element.show.name}
                                        <br>
                                        ${rating}
                                        Genres:${element.show.genres}
                                        <br>    
                                        Description:${element.show.summary}
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>`);
                }
            }
            else
            {
                deathdate = '';
                today = new Date();
                if(element.person.deathday == null)
                    DoB = new Date(element.person.birthday);
                else
                {
                    today = new Date(element.person.deathday);
                    DoB = new Date(element.person.birthday);
                    deathdate = `Died on: ${element.person.deathday}
                                <br>`;
                }
                let age = today.getFullYear() - DoB.getFullYear();
                if(today.getMonth() < DoB.getMonth() || (today.getMonth() == DoB.getMonth() && today.getDate() < DoB.getDate()))
                {
                    age--;
                }
                try
                {
                    resultList.insertAdjacentHTML('beforeend',
                        `<div id='rsizer' class="${cls} p-4">
                            <div class="movies">
                                <div class="imgdivwrap" style="max-height:300px;max-width:200px;">
                                    <a href="${element.person.url}" target="_blank">
                                        <img style="width:200px;height:300px;" src="${element.person.image.original}" alt="movie card">
                                        <div class="overlay">
                                            Name:${element.person.name}
                                            <br>
                                            Country:${element.person.country.name}
                                            <br>
                                            Birthday:${element.person.birthday} (${age})
                                            <br>
                                            ${deathdate}
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>`);
                }
                catch(e){}
            }
            window.scrollTo(0,850);
        }
    });
    clearWebsite();
}

function resizer(){
    screenwidth = window.innerWidth;
    if(screenwidth >= 580 && screenwidth <= 768){
        ids = document.querySelectorAll('#rsizer');
        for(const el of ids){
            el.classList.remove('col-sm-3');
            el.classList.remove('p-4');
            el.classList.add('col-sm-6');
            el.classList.add('p-4');
        }
    }
    if(screenwidth >= 769){
        ids = document.querySelectorAll('#rsizer');
        for(const el of ids){
        el.classList.remove('col-sm-6');
        el.classList.remove('p-4');
        el.classList.add('col-sm-3');
        el.classList.add('p-4');
        }
    }
}

function clearWebsite(){
    search_results = document.querySelectorAll(".col-sm-3.p-4");
    for(const element of search_results){
        element.remove();
    }
}

function onlySpaces(input){
    return input.trim().length === 0;
}

function carouseltrend(){
    ok = 0;
    fetch(trending).then((response) => response.json()).then((d) => {
        d = d.slice(0,10);
        trendList.insertAdjacentHTML('beforeend',
        `
        <div class="item active">   
            <a target="_blank" href="${d[0].show.url}"><img src="${d[0].show.image.original}" alt="movie card" style="height:500px;width:500px;"></a>
        </div>
        `);
        d = d.slice(1,10);
        for(const e of d){
            trendList.insertAdjacentHTML('beforeend', 
                `
                <div class="item">
                    <a target="_blank" href="${e.show.url}"><img src="${e.show.image.original}" alt="movie card" style="height:500px;width:500px;"></a>
                </div>
                `);
        }
    });
}

window.onload=function(){
    carouseltrend();
    key_press = document.getElementById('tsearch');
    key_press.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
            event.preventDefault();
            getInputValue();
        }
    });
}