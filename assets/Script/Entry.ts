import { _decorator, Component, Node, Button, instantiate, Color, color, Sprite, Vec3, Label, Game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Entry')
export class Entry extends Component {
    private rootNode: Node = null;
    private tipsNode: Node = null;
    private btn_star: Button = null;
    private btn_click: Button = null;
    private nodeItem: Node = null;
    private txt_lesson: Label = null;
    private txt_normal: Label = null;
    private txt_different: Label = null;
    private time = 60;

    private orgColor: Color = null;
    private diffColor: Color = null;

    private colorX = 0;
    private colorY = 0;

    private game = [[]];
    private checkPoint = 100;

    /**
     * 当前关卡
     */
    private get lesson(): number {
        return 101 - this.checkPoint;
    }
    onLoad() {
        this.tipsNode = this.node.getChildByName("node_tips");
        this.btn_star = this.tipsNode.getChildByName("btn_start").getComponent(Button);
        this.rootNode = this.node.getChildByName("node_root");
        this.btn_click = this.node.getChildByName("btn_click").getComponent(Button);
        this.nodeItem = this.tipsNode.getChildByName("node_item");
        this.txt_lesson = this.node.getChildByName("txt_lesson").getComponent(Label);
        this.txt_normal = this.node.getChildByName("txt_normal").getComponent(Label);
        this.txt_different = this.node.getChildByName("txt_different").getComponent(Label);

        this.btn_star.node.on(Button.EventType.CLICK, this.starGame, this);

    }
    start() {
        
    }
    private starGame() {
        this.tipsNode.active = false;
        this.schedule(this.checkGameEnd, 1, 60);
        this.getLesson();
    }
    /**
     * 设置游戏 开启关卡
     */
    private getLesson() {
        this.setColor();
        this.startLesson();
        this.refreshTxt();
    }
    private setColor() {
        let r = Math.ceil(Math.random() * 255);
        let g = Math.ceil(Math.random() * 255);
        let b = Math.ceil(Math.random() * 255);
        // let changeNum = Math.ceil(Math.random()*3);

        this.orgColor = new Color(r, g, b);
        let num = this.checkPoint + b;
        if (num > 255) {
            this.diffColor = new Color(r, g, b - this.checkPoint);
        } else {
            this.diffColor = new Color(r, g, num);
        }
    }
    private startLesson() {
        let check = this.lesson;
        if (check <= 5) {//2
            this.OpenPanel(2);
        } else if (check <= 10) {//3
            this.OpenPanel(3);
        } else if (check <= 15) {//4
            this.OpenPanel(4);
        } else if (check <= 20) {//5
            this.OpenPanel(5);
        } else {//6
            this.OpenPanel(6);
        }
    }

    private refreshTxt() {
        this.txt_lesson.string = "当前关卡：" + this.lesson;
        this.txt_normal.string = this.orgColor.toString();
        this.txt_different.string = this.diffColor.toString();
    }

    private OpenPanel(index: number) {
        this.colorX = Math.ceil(Math.random() * index) - 1;
        this.colorY = Math.ceil(Math.random() * index) - 1;
        let x = (index - 1) * (-52);
        let y = (index - 1) * 52;
        for (let i = 0; i < index; i++) {
            for (let j = 0; j < index; j++) {
                if (!this.game[i]) {
                    this.game[i] = [];
                }
                if (!this.game[i][j]) {
                    let node = this.getNode(i, j);
                    node.parent = this.rootNode;
                    this.game[i][j] = node;
                }
                this.game[i][j].position = new Vec3(j * 104 + x, i * (-104) + y);
                if (i == this.colorX && j == this.colorY) {
                    this.game[i][j].getComponent(Sprite).color = this.diffColor;
                } else {
                    this.game[i][j].getComponent(Sprite).color = this.orgColor;
                }
            }
        }
    }

    private getNode(i, j) {
        let nodeItem = instantiate(this.nodeItem);
        nodeItem.name = i + "_" + j;
        nodeItem.on(Button.EventType.CLICK, this.onItemTouch, this);
        return nodeItem;
    }
    private onItemTouch(btn: Button) {
        //检测当前点击的是否正确
        let posId = btn.node.name.split("_");
        let i = Number(posId[0]);
        let j = Number(posId[1]);
        if (i == this.colorX && j == this.colorY) {
            this.checkPoint--;
            this.getLesson();
        } else {
            //停止游戏
            //showEnd
        }
    }
    private checkGameEnd() {
        if (this.time > 0) {
            this.time--;
        } else {
            //停止游戏
            //显示结束按钮
        }
    }

    update(deltaTime: number) {

    }



}

