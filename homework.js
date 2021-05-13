"use strict";

(function() {
    function isPlainMode() {
        if (window.location.search) {
            const params = new URLSearchParams(window.location.search);
            if (params.has("plain"))
                return true;
        }
        
        return false;
    }
    
    const plain_mode = isPlainMode();
    
    if (plain_mode)
        document.querySelector("html").classList.remove("fancy");
    
    // Insert an anchor before each problem, and if there is a problem links ul,
    // add a link to it
    const problems = document.querySelectorAll(".problem");
    const nav_ul = document.querySelector("ul.problem-links");
    for (let i = 0; i < problems.length; ++i) {
        const problem_number = i + 1;
        const anchor_name = "p" + problem_number;
        const anchor = document.createElement("a");
        anchor.setAttribute("name", anchor_name);
        problems[i].parentElement.insertBefore(anchor, problems[i]);
        
        if (nav_ul) {
            const li = document.createElement("li");
            const link = document.createElement("a");
            link.setAttribute("href", "#p" + problem_number);
            const text = document.createTextNode("Problem " + problem_number);
            link.appendChild(text);
            li.appendChild(link);
            nav_ul.appendChild(li);
        }
    }
    
    // Watch document scrolls and highlight the link to the current
    // problem
    let current_tab = null;
    let current_problem = -1;
    
    function updateCurrent() {
        const viewportHeight = document.querySelector("html").clientHeight;
        let new_current_problem = -1;
        for (let i = problems.length - 1; i >= 0; --i) {
            const client_rect = problems[i].getBoundingClientRect();
            if (client_rect.top < viewportHeight * 0.3) {
                new_current_problem = i;
                break;
            }
        }
        
        if (new_current_problem === -1 && problems.length > 0)
            new_current_problem = 0;
        
        if (new_current_problem !== current_problem) {
            if (current_tab !== null)
                current_tab.classList.remove("current");
            if (new_current_problem !== -1) {
                current_tab = document.querySelectorAll("nav ul li")[new_current_problem];
                current_tab.classList.add("current");
            } else
                current_tab = null;
            
            current_problem = new_current_problem;
        }
    }
    
    if (nav_ul) {
        document.addEventListener("scroll", updateCurrent);
        updateCurrent();
    }
    
    for (let problem of problems) {
        const total_points = problem.querySelector(".total.points");
        const points = problem.querySelectorAll(".points:not(.total)");
        
        if (!total_points)
            continue;
        
        let sum = 0;
        for (let point of points) {
            const value = parseInt(point.innerText);
            if (!isNaN(value)) {
                sum += value;
                if (!point.hasAttribute("title"))
                    point.setAttribute("title", value + (value === 1 ? " point" : " points"));
            }
        }
        
        if (total_points && total_points.innerText.trim() === "")
            total_points.innerText = sum + (sum === 1 ? " point" : " points");
    }

    
    const homework_total_points_box = document.querySelector(".assignment-info .total.points");
    if (homework_total_points_box) {
        let homework_total_points = 0;
        const points_pattern = /^\s*(\d+)\s+points?\s*$/i;
        for (let problem_total_points of document.querySelectorAll(".problem .total.points")) {
            const match = points_pattern.exec(problem_total_points.innerText);
            if (match)
                homework_total_points += parseInt(match[1]);
        }
        
        homework_total_points_box.innerText = homework_total_points + (homework_total_points === 1 ? " point" : " points");
    }

    if (plain_mode) {
        let problem_counter = 1;
        for (let problem of document.querySelectorAll(".problem:not(.no-number)")) {
            const problem_number_display = document.createElement("div");
            problem_number_display.classList.add("problem-number");
            problem_number_display.innerText = "Problem " + problem_counter;
            problem.insertBefore(problem_number_display, problem.firstChild);
            ++problem_counter;
        }
        
        for (let point of document.querySelectorAll(".problem .points:not(.total)")) {
            point.innerText = "(" + point.innerText + " points)";
        }
    }
})();
