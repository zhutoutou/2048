var Game = function () {
    //dom元素
    var gameDiv;
    //行数
    var row = 4;
    //是否结束
    var result = false;

    //生成数据
    var initData = function (x, y) {
        var data = [];
        for (var i = 0; i < y; i++) {
            var item = [];
            for (var j = 0; j < x; j++) {
                item.push(0);
            }
            data.push(item)
        }
        return data;
    }

    //游戏区数据
    var gameData = initData(row, row);

    //divs
    var gameDivs = initData(row, row);

    var removeDivs = [];
    //#region Dom设置
    //初始化背景Div
    var initBcakDiv = function (container) {
        var data = initData(row, row);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                var newNode = document.createElement('div');
                newNode.className = 'none';
                newNode.style.top = (i * (50 + 10)) + 'px';
                newNode.style.left = (j * (50 + 10)) + 'px';
                container.appendChild(newNode);
            }
        }
    }

    //初始化游戏Divs
    var initDiv = function (container, data, divs) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] != 0) {
                    var newNode = document.createElement('div');
                    newNode.className = GetClass(data[i][j]);
                    newNode.style.top = (i * (50 + 10)) + 'px';
                    newNode.style.left = (j * (50 + 10)) + 'px';
                    newNode.innerHTML = data[i][j].toString();
                    container.appendChild(newNode);
                    //更新全局数据
                    divs[i][j] = newNode;
                }
            }
        }
    }

    //页面刷新
    var refreshDiv = function (container, data, divs, removedivs, node) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] != 0) {
                    divs[i][j].className = GetClass(data[i][j]);
                    divs[i][j].style.top = (i * (50 + 10)) + 'px';
                    divs[i][j].style.left = (j * (50 + 10)) + 'px';
                    divs[i][j].innerHTML = data[i][j].toString();
                }
            }
        }
        //删除被合并的元素
        removedivs.forEach(element => {
            element.parentNode.removeChild(element);
        });
        if (node) {
            /*             //增加新增的元素
                        var newNode = document.createElement('div');
                        newNode.className = GetClass(node.value);
                        newNode.style.top = (node.i * (50 + 10) + 20) + 'px';
                        newNode.style.left = (node.j * (50 + 10) + 20) + 'px';
                        //制造出现效果
                        newNode.style.width = '10px';
                        newNode.style.height = '10px';
                        newNode.innerHTML = node.value;
                        container.appendChild(newNode);
                        setTimeout(() => {
                            newNode.style.top = (node.i * (50 + 10)) + 'px';
                            newNode.style.left = (node.j * (50 + 10)) + 'px';
                            newNode.style.width = '50px';
                            newNode.style.height = '50px';
                        }, 0); */
            var newNode = document.createElement('div');
            newNode.className = GetClass(node.value);
            newNode.style.top = (node.i * (50 + 10)) + 'px';
            newNode.style.left = (node.j * (50 + 10)) + 'px';
            newNode.style.width = '50px';
            newNode.style.height = '50px';
            newNode.innerHTML = node.value;
            container.appendChild(newNode);

            //更新全局数据
            data[node.i][node.j] = node.value;
            divs[node.i][node.j] = newNode;

        }
    }
    //#endregion

    //移动实现
    var move = function (dir) {
        if (result) return;
        var data = gameData
        //旋转统一方向
        rotate(dir, data, gameDivs);
        //合并
        var blnChanged = combine(data, gameDivs, removeDivs);
        if (blnChanged) {
            //增加新的随机节点
            var node = addElement(data);
            //恢复默认方向
            anti_rotate(dir, data, gameDivs, node);
            gameData = data;
            refreshDiv(gameDiv, gameData, gameDivs, removeDivs, node);
            removeDivs = [];
        }
        else {
            //恢复默认方向
            anti_rotate(dir, data, gameDivs, node);
        }
        //判断是否结束
        var result = checkGameOver(gameData);
        if (result) {
            alert('Game Over');
        }
    }

    //#region 旋转数组,以向上为标准
    //dir up-0;left-1;down-2;right-3
    //顺时针旋转 
    var rotate = function (dir, data, divs) {
        for (let index = 0; index < dir; index++) {
            rotateOnce(data, divs);
        }
    }

    //顺时针旋转90度
    var rotateOnce = function (data, divs) {
        var temp = initData(row, row);
        var tempDivs = initData(row, row);
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < row; j++) {
                temp[j][row - 1 - i] = data[i][j];
                tempDivs[j][row - 1 - i] = divs[i][j];
            }
        }
        clone(data, temp);
        clone(divs, tempDivs);
    }

    //逆时针旋转
    var anti_rotate = function (dir, data, divs, node) {
        for (let index = 0; index < dir; index++) {
            anti_rotateOnce(data, divs, node);
        }
    }

    //逆时针旋转90度
    var anti_rotateOnce = function (data, divs, node) {
        var temp = initData(row, row);
        var tempDivs = initData(row, row);
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < row; j++) {
                temp[i][j] = data[j][row - 1 - i];
                tempDivs[i][j] = divs[j][row - 1 - i];
            }
        }
        if (node) {
            var value = node.i;
            node.i = row - 1 - node.j;
            node.j = value;
        }
        clone(data, temp);
        clone(divs, tempDivs);
    }
    //#endregion

    //#region 合并数组
    //相同值合并
    var combine = function (data, divs, removedivs) {
        var temp = initData(row, row);
        clone(temp, data);
        //合并前紧凑 存在变化则为true,没有变化则为false
        simplify(data, divs);
        //合并
        for (let i = 1; i < row; i++) {
            for (let j = 0; j < row; j++) {
                if (data[i][j] == 0) continue;
                if (data[i][j] == data[i - 1][j]) {
                    data[i - 1][j] = 2 * data[i][j]
                    data[i][j] = 0;
                    var div = divs[i - 1][j];
                    removedivs.push(div);
                    divs[i - 1][j] = divs[i][j];
                    divs[i][j] = 0;
                }
            }
        }
        //合并后紧凑
        simplify(data, divs);
        return JSON.stringify(temp) == JSON.stringify(data) ? false : true;
    }

    //去空隙,紧凑数组
    var simplify = function (temp, divs) {
        for (let j = 0; j < row; j++) {
            for (let i = 1; i < row; i++) {
                if (temp[i - 1][j] == 0) {
                    for (let k = i; k < row; k++) {
                        if (temp[k][j] != 0) {
                            temp[i - 1][j] = temp[k][j];
                            temp[k][j] = 0;
                            divs[i - 1][j] = divs[k][j];
                            divs[k][j] = 0;
                            break;
                        }
                    }
                }
            }
        }
    }
    //#endregion

    //#region 添加新的随机节点
    //添加算法
    var addElement = function (data) {
        var array = [];
        for (let i = 0; i < row * row; i++) {
            if (data[Math.floor(i / row)][i % row] == 0)
                array.push(i);
        }

        if (array.length > 0) {
            var k = array[Math.ceil(Math.random() * array.length) - 1];
            var randomValue = Math.ceil(Math.random() * 3) - 1;
            return {
                value: randomValue == 0 ? 4 : 2,
                i: Math.floor(k / row),
                j: k % row,
            };
        } else {
            return undefined;
        }
    }

    //检验游戏是否结束
    //两次卷积验证
    var checkGameOver = function (data) {
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < row; j++) {
                if (data[i][j] == 0) return false;
            }
        }
        for (var i = 0; i < data.length; i++) {
            for (var j = 1; j < data[i].length; j++) {
                if (data[i][j] == data[i][j - 1]) {
                    return false;
                }
            }
        }
        for (var i = 1; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                if (data[i][j] == data[i - 1][j]) {
                    return false;
                }
            }
        }
        return true;
    }
    //#endregion


    // 初始化
    var init = function (doms) {
        gameDiv = doms.gameDiv;
        initBcakDiv(gameDiv);
        gameData = [
            [0, 0, 2, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 2],
            [0, 0, 2, 4]
        ];
        initDiv(gameDiv, gameData, gameDivs);
    }

    //#region 辅助方法
    //根据值获取对应的样式
    function GetClass(value) {
        var className = '';
        switch (value) {
            case 2:
                className = 'typeOne';
                break;
            case 4:
                className = 'typeTwo';
                break;
            case 8:
                className = 'typeThree';
                break;
            case 16:
                className = 'typeFour';
                break;
            case 32:
                className = 'typeFive';
                break;
            case 64:
                className = 'typeSix';
                break;
            case 128:
                className = 'typeSeven';
                break;
            case 256:
                className = 'typeEight';
                break;
            case 512:
                className = 'typeNine';
                break;
            case 1024:
                className = 'typeTen';
                break;
            case 2048:
                className = 'typeEleven';
                break;
            case 4096:
                className = 'typeTwenty';
                break;
            default:
                className = 'typeOne';
                break;
        }
        return className;
    }

    //克隆对象
    var clone = function (arr1, arr2) {
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < row; j++) {
                arr1[i][j] = arr2[i][j];
            }
        }
    }
    //#endregion

    // 导出API
    this.init = init;
    this.move = move;
}


