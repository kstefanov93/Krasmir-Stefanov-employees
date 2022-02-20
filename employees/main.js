
const input = document.querySelector('.js-input');
const table = document.querySelector('.js-table');
let data = '';
let arrayData = [];
let convertedDataset = [];

const handleInout = () => {
    input.addEventListener('change', () => {
        loadFile();
    }, false); 
}; 

handleInout();

const loadFile = () => {
    const reader = new FileReader();
    reader.onload = function() {
        data = reader.result.toString();

        const convertedString = parseCSV(data);
        convertData(convertedString);
    }

    if (!input.files[0]) {
        return
    }

    reader.readAsText(input.files[0]);
}; 

const convertData = (data) => {
    if (! data) {
        return
    }

    const item = data.forEach((element, index) => {
        if (element.length === 4) {
            const obj = {
                emp: element[0].trim(),
                projectId: element[1].trim(),
                timeStart: element[2].trim(), 
                timeEnd: element[3].trim()
            }; 

            convertedDataset.push(obj);
        } else {
            return undefined;
        }
    });

    groupProjects(convertedDataset);
}; 

const groupProjects = (obj) => {
    const project = obj.reduce((item, el) => {
        const key = el['projectId'];
        let element = item[key];

        if (! element) {
            element = item[key] = [];
        } 

        element.push(el);  
        return item;
    }, []); 

    sortPairs(project);
}; 

const sortPairs = (el) => {
    el.forEach((element, index) => {
        element.sort((a, b) => {
            const emp1 = a.emp;
            const emp2 = b.emp;
            const emp1Project = a.projectId;
            const emp2Project = b.projectId;
            const emp1Start = a.timeStart;
            const emp1End = a.timeEnd;
            const emp2Start = b.timeStart;
            const emp2End = b.timeEnd;

            if (emp1Project === emp2Project && emp1 !== emp2 ) {
                const timePassed = calculateTime(emp1Start, emp1End, emp2Start, emp2End);

                if (timePassed > 0) {
                    displayResult(emp1, emp2, emp1Project, timePassed); 
                }
            }    
        }); 
    });
}; 

const calculateTime = (emp1Start, emp1End, emp2Start, emp2End) => {
    const startDate1 = new Date(emp1Start);
    const endDate1 = emp1End === null ? new Date() : new Date(emp1End);
    const startDate2 = new Date(emp2Start);
    const endDate2 = emp2End === null ? new Date() : new Date(emp2End);
    const start = startDate1 < startDate2 ? startDate2 : startDate1;
    const end = endDate1 < endDate2 ? endDate1 : endDate2;

    if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
  
    return 0;
};

const displayResult = (emp1, emp2, projectId, time) => {
    const row = table.insertRow();
    const empl1 = row.insertCell();
    const empl2 = row.insertCell();
    const project = row.insertCell();
    const days = row.insertCell();

    empl1.innerHTML = emp1;
    empl2.innerHTML = emp2;    
    project.innerHTML = projectId;
    days.innerHTML = time;
};

const parseCSV = (str) => {
    let arr = [];
    let quote = false;  

    for (let row = 0, col = 0, c = 0; c < str.length; c++) {
        let cc = str[c], nc = str[c+1];        
        arr[row] = arr[row] || [];             
        arr[row][col] = arr[row][col] || '';   

        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        if (cc == '"') { quote = !quote; continue; }

        if (cc == ',' && !quote) { ++col; continue; }

        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

        if (cc == '\n' && !quote) { ++row; col = 0; continue; }

        if (cc == '\r' && !quote) { ++row; col = 0; continue; }
        arr[row][col] += cc;
    }
    return arr;
};
