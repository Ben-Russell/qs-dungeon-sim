import { Fighter } from "../datamodels/fighter";

import { config } from "./config";

export interface SimResult {
    wins: number;
    losses: number;
    winrate: number;

}


export class SimWorker {

    private fighters: Fighter[];
    private fightergear:{};
    private simType: "dungeon" | "cave";
    private simLevel: number;

    private worker?:Worker;
    private messageHandlers: { [type:string]: Function} = {};
    private messageQueue: MessageEvent[] = [];

    constructor(
        fighters: Fighter[] = [],
        fightergear:{} = {},
        simType: "dungeon" | "cave" = "dungeon",
        simLevel: number = 1500
    ) {
        this.fighters = fighters;
        this.fightergear = fightergear;
        this.simType = simType;
        this.simLevel = simLevel;
        this.create();
    }

    private create() {
        if(this.worker) {
            return this.worker;
        }

        this.worker = new Worker(config.workerPath);
        this.worker.onmessage = this.handleOnMessage.bind(this);
    }

    private handleOnMessage(e: MessageEvent) {
        for(const type in this.messageHandlers) {
            if(type === e.data.type) {
                let handler = this.messageHandlers[type];
                handler(e);
                return;
            }
        }
        // should only get here if no handler failed 
        // so push this to the queue to save
        this.messageQueue.push(e);
    }
    
    private replayQueue() {
        for(let i=0, iL = this.messageQueue.length; i<iL; i++) {
            let message = this.messageQueue.shift();
            if(message) {
                this.handleOnMessage(message);
            }
        }
    }

    public start() {
        if(!this.worker) {
            return;
        }
        this.worker.postMessage({ 
            type: "startSim",
            fighters: this.fighters,
            fightergears: this.fightergear ,
            simType: this.simType,
            simLevel: this.simLevel
    
        });
    }

    public attachResultHandler(type: string, handler: Function) {
        this.messageHandlers[type] = handler;
        if(this.messageQueue.length > 0) {
            this.replayQueue();
        }
    }
}