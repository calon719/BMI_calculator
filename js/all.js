// BMI 計算器
// DOM
const height = document.querySelector('.height');
const weight = document.querySelector('.weight');
const calBtn = document.querySelector('.calBtn');
const resultView = document.querySelector('.result');
const resetBtn = document.querySelector('.result-btn');
const list = document.querySelector('.history');
const deleteBtn = document.querySelector('.deleteBtn');
const nothing = document.querySelector('.nothing');
const warning = document.querySelector('.warng');

// model
const BMIStates = {
    low:{
        state: '過輕',
        color: 'text-low',
        border: 'border-low',
        borderLeft: 'borderLeft-low',
        background: 'bg-low'
    },
    normal:{
        state: '理想',
        color: 'text-normal',
        border: 'border-normal',
        borderLeft: 'borderLeft-normal',
        background: 'bg-normal'
    },
    obeseI:{
        state: '過重',
        color: 'text-obeseI',
        border: 'border-obeseI',
        borderLeft: 'borderLeft-obeseI',
        background: 'bg-obeseI'
    },
    obeseII:{
        state: '輕度肥胖',
        color: 'text-obeseII',
        border: 'border-obeseII',
        borderLeft: 'borderLeft-obeseII',
        background: 'bg-obeseII'
    },
    obeseIII:{
        state: '中度肥胖',
        color: 'text-obeseII',
        border: 'border-obeseII',
        borderLeft: 'borderLeft-obeseII',
        background: 'bg-obeseII'
    },
    obeseIIII:{
        state: '重度肥胖',
        color: 'text-obeseIIII',
        border: 'border-obeseIIII',
        borderLeft: 'borderLeft-obeseIIII',
        background: 'bg-obeseIIII'
    }
};
Object.freeze(BMIStates);
let data = JSON.parse(localStorage.getItem('BMIhistory')) || [] // model 當 localStorage 有資料時取出其中資料或為空陣列

// 初始化 //
// 清除歷史紀錄 btn 使用者第一次打開網頁時隱藏起來，當有紀錄時才開啟   // view
function defaultView(){
    if(data.length === 0){
        deleteBtn.setAttribute('class','deleteBtn hidden');
        list.setAttribute('class','history hidden');
        nothing.setAttribute('class','nothing');
    }else {
        updateList();
    }
};
defaultView();
////////////

// event
calBtn.addEventListener('click',check,false);
deleteBtn.addEventListener('click',clearAll,false);
resetBtn.addEventListener('click',reset,false);
list.addEventListener('click',deleteList,false);

// 檢查輸入的資料
function check(){
    if(height.value === '' || weight.value === '' ||height.value <= 0 || weight.value <=0){
    warning.setAttribute('class','warng');
    } else{
        warning.setAttribute('class','warng hidden');
    calculator();
    };
};

// 計算結果
function calculator(){
    let h = parseFloat(height.value)/100;
    let w = parseFloat(weight.value);
    let result = w/(h*h);
    result = result.toFixed(2);
    saveData(result); // 將 BMI 帶入參數
};

// 根據計算結果設立條件並分類再儲存至 localStorage
function saveData(BMI){
    let status = '';
    if(BMI<= 18.5){
        status = BMIStates.low;
    } else if(18.5 < BMI&& BMI<=25){
        status = BMIStates.normal;
    } else if(25 < BMI&& BMI<=30){
        status = BMIStates.obeseI;
    } else if(30 < BMI&& BMI<=35){
        status = BMIStates.obeseII;
    } else if(35 < BMI&& BMI<=40){
        status = BMIStates.obeseIII;
    } else if(40 < BMI){
        status = BMIStates.obeseIIII;
    };

    // 獲得日期
    let getDate = new Date();
    let year = getDate.getFullYear();
    let month = getDate.getMonth()+1;
    let date = getDate.getDate();

    // 資料 object
    let BMIdata = {
        height: height.value,
        weight: weight.value,
        result: BMI,
        status: status,
        time: `${month}-${date}-${year}`
    };
    
    // 將資料加入 data 並存入 localStorage
    // 最新資料為陣列第一筆
    data.splice(0,0,BMIdata);
    localStorage.setItem('BMIhistory',JSON.stringify(data));
    
    showResult(); 
    updateList(); 

    if(data.length > 10 ){
        over10();
    };
};

// 根據 result  結果畫面顯示不同顏色
// 含有 resetBtn
function showResult(){
    // 隱藏 calBtn 並顯示 result 畫面
    calBtn.setAttribute('class','calBtn hidden');
    resultView.setAttribute('class','result '+data[0].status.color);

    // result 畫面
    const BMIStr = document.querySelector('.result-circle p');
    const stateStr = document.querySelector('.result-state');
    const resultCircle = document.querySelector('.result-circle');

    BMIStr.innerHTML = data[0].result;
    stateStr.innerHTML = data[0].status.state;
    resultCircle.setAttribute('class','result-circle '+data[0].status.border);
    resetBtn.setAttribute('class','result-btn '+data[0].status.background);
    // resetBtn 按下後重新整理頁面
    
};

// 點擊結果畫面右下 btn 回到計算畫面
function reset(e){
    e.preventDefault();
    // 清空 input
    height.value = '';
    weight.value = '';
    
    // 隱藏 result 顯示 calculator
    calBtn.setAttribute('class','calBtn');
    resultView.setAttribute('class','result hidden');
};

// 每次再訪或重整網頁時從 localStorage 提取結果並呈現歷史紀錄畫面
// 根據結果  歷史紀錄畫面顯示不同顏色
// 歷史紀錄要有日期
function updateList(){
    // 清除初始化
    list.setAttribute('class','history');
    deleteBtn.setAttribute('class','deleteBtn');
    nothing.setAttribute('class','nothing hidden');

    let str = '';
    for(let i = 0; i < data.length; i++){
        let txt = 
            `<li class="history-list ${data[i].status.borderLeft}">
                <p>${data[i].status.state}</p>
                <div class="txt">
                    <p>
                        <span>BMI</span>
                        ${data[i].result}
                    </p>
                    <p style="margin-right: 40px;margin-left: 40px;">
                        <span>weight</span>
                        ${data[i].weight}
                    </p>
                    <p>
                        <span>height</span>
                        ${data[i].height}
                    </p>
                </div>
                <span>${data[i].time}</span>
                <a data-index="${i}" href="#"></a>
            </li>`
        str += txt;
    };
    list.innerHTML = str;
};

// data > 10 筆 刪除 data[10](第11筆 最舊資料)
function over10(){
    data.splice(10,1);
    localStorage.setItem('BMIhistory',JSON.stringify(data));
    updateList();
}


// 清除資料
function clearAll(e){
    e.preventDefault();
    localStorage.removeItem('BMIhistory');
    data = [];
    deleteBtn.setAttribute('class','deleteBtn hidden');
    list.setAttribute('class','history hidden');
    nothing.setAttribute('class','nothing');
}

function deleteList(e){
    e.preventDefault();
    if(e.target.nodeName !== 'A'){return};
    // 取得當前 li data-index[i]  == data[i]
    let num = e.target.dataset.index;

    // 從 data 刪除此筆資料
    data.splice(num,1);
    // 重新儲存
    localStorage.setItem('BMIhistory',JSON.stringify(data));
    
    // 更新畫面
    defaultView();
    }