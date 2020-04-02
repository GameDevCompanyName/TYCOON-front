import * as PIXI from 'pixi.js';

// window.onload = initPixiApp;

let app: PIXI.Application;
let mapContainer: PIXI.Container;

let scale = 1.0;
let offsetX = 0;
let offsetY = 0;

let oldX = 0;
let oldY = 0;
let newX = 0;
let newY = 0;
let movementInProgress = false;

let mapWidth = 0;
let mapHeight = 0;

let neighboursMap = new Map<number, Array<number>>();
let polygonsMap = new Map<number, PIXI.Graphics>();
let metaDataMap = new Map<PIXI.Graphics, PolygonMetaData>();

export function initPixiApp() {
    app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight
    });

    let parentDiv = getParentDiv();
    parentDiv.appendChild(app.view);
    app.renderer.backgroundColor = 0xF1F1FF;
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoDensity = true;
    // app.renderer.resize(mapWidth, mapHeight);

    mapContainer = new PIXI.Container();
    app.stage.addChild(mapContainer);

    let playerCircle = new PIXI.Graphics();
    playerCircle.beginFill(0xFFFFFF);
    playerCircle.drawCircle(mapWidth / 2, mapHeight / 2, 10 * scale);
    app.stage.addChild(playerCircle);

    function resize() {
        let div = getParentDiv();
        mapWidth = div.offsetWidth; //TODO
        mapHeight = div.offsetHeight; //TODO
        playerCircle.x = mapWidth / 2;
        playerCircle.y = mapHeight / 2;
        app.renderer.view.style.width = mapWidth + 'px';
        app.renderer.view.style.height = mapHeight + 'px';
        app.renderer.view.width = mapWidth;
        app.renderer.view.height = mapHeight;
    }
    resize();
    window.onresize = resize;

    return app;
}

function getParentDiv() : HTMLDivElement {
    return document.querySelector(".city-card__map") as (HTMLDivElement);
}

function main() {
    initPixiApp();
}

function displayWorld(worldText: string) {
    let worldObject = JSON.parse(worldText);
    let cities = worldObject.cities;

    for (let i = 0; i < cities.length; i++) {
        displayCity(cities[i]);
    }
}

function highlightNeighbours(id: number) {
    let neighbourIds = neighboursMap.get(id);
    for (let i = 0; i < neighbourIds.length; i++) {
        let polygon = polygonsMap.get(neighbourIds[i]);
        if (polygon != null) {
            polygon.tint = 0xFF0000;
        }
    }
}

function resetNeighbours(id: number) {
    let neighbourIds = neighboursMap.get(id);
    for (let i = 0; i < neighbourIds.length; i++) {
        let polygon = polygonsMap.get(neighbourIds[i]);
        if (polygon != null) {
            // polygon.tint = polygon.defaultColor;
            polygon.tint = metaDataMap.get(polygon).defaultColor;
        }
    }
}

function updateMainContainer() {
    newX = -(offsetX - mapWidth / 2);
    newY = -(offsetY - mapHeight / 2);
    oldX = mapContainer.x;
    oldY = mapContainer.y;
    animate(
        inOutQuad,
        fromOldToNew,
        1000
    );
}

function fromOldToNew(progress: number) {
    let currentX = oldX + (newX - oldX) * progress;
    let currentY = oldY + (newY - oldY) * progress;
    mapContainer.x = currentX;
    mapContainer.y = currentY;
}

function displayCity(city: any) {
    neighboursMap.set(city.siteId, city.neighbours);

    const pointsX = city.polygon.pointsX;
    const pointsY = city.polygon.pointsY;

    let maxX = -99999;
    let maxY = -99999;
    let minX = 99999;
    let minY = 99999;

    let points = [];
    for (let i = 0; i < pointsX.length; i++) {
        let x = pointsX[i] * scale;
        let y = pointsY[i] * scale;
        if (x > maxX) maxX = x;
        if (x < minX) minX = x;
        if (y > maxY) maxY = y;
        if (y < minY) minY = y;
        points.push(x);
        points.push(y);
    }

    let midX = (maxX + minX) / 2;
    let midY = (maxY + minY) / 2;

    let polygon = new PIXI.Graphics();
    metaDataMap.set(polygon, new PolygonMetaData());
    let data = metaDataMap.get(polygon);
    data.id = city.siteId;
    data.midX = midX;
    data.midY = midY;
    polygon.interactive = true;
    // @ts-ignore
    polygon.mouseover = function (mouseEvent) {
        this.tint = 0xFFFFFF;
        highlightNeighbours(metaDataMap.get(this).id);
    };
    // @ts-ignore
    polygon.mouseout = function (mouseEvent) {
        this.tint = this.defaultColor;
        resetNeighbours(metaDataMap.get(this).id);
    };
    // @ts-ignore
    polygon.click = function (mouseEvent) {
        if (!movementInProgress) {
            offsetX = metaDataMap.get(this).midX;
            offsetY = metaDataMap.get(this).midY;
            updateMainContainer();
        }
    };
    let color = getRandomNumber(16777214);
    polygon.beginFill(0xFFFFFF, 1.0);
    polygon.tint = color;
    metaDataMap.get(polygon).defaultColor = color;
    polygon.lineStyle(1, 0x110000);
    polygon.drawPolygon(points);
    polygon.endFill();
    polygon.x = offsetX;
    polygon.y = offsetY;
    polygonsMap.set(city.siteId, polygon);
    mapContainer.addChild(polygon);

    let text = new PIXI.Text(city.siteId);
    text.x = offsetX + midX - 7;
    text.y = offsetY + midY - 3;
    text.style.fontSize = 10;
    mapContainer.addChild(text);
}

function getRandomNumber(max: number) {
    return Math.random() * Math.floor(max);
}

// function animate({timing, callback, duration}) {
function animate(
    timing: Function,
    callback: Function,
    duration: number
) {
    movementInProgress = true;
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        // timeFraction изменяется от 0 до 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        // вычисление текущего состояния анимации
        let progress = timing(timeFraction);

        callback(progress); // отрисовать её

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        } else {
            movementInProgress = false;
        }
    });
}

function linear(t: number) {
    return t;
}

function inOutQuad(t: number) {
    t *= 2;
    if (t < 1) return 0.5 * t * t;
    return -0.5 * (--t * (t - 2) - 1);
}

class PolygonMetaData {
    defaultColor: number;
    midX: number;
    midY: number;
    id: number;
}
