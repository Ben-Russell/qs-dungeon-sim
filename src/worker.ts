import { Sim } from "./sim/Sim";
import { Fighter, FighterClasses } from "./datamodels/fighter";

onmessage = function(e) {
    console.log('Message received from main script');
    console.log('worker data', e.data);
    if(e.data.type === "startSim") {
      const simResult = runSim(
        e.data.fighters,
        e.data.fightergears,
        e.data.simType,
        e.data.simLevel
      );
    }
    

    
  }


const runSim = (
  fighters:Fighter[],
  fightergears:{},
  simType: "dungeon" | "cave",
  simLevel: number
  ) => {
  let sim = new Sim(fighters, fightergears, simType, simLevel);
  sim.Start();
  
  console.log('sim results');
    postMessage({
      type: "simResults",
      results: {
        wins: sim.Wins,
        losses: sim.Losses,
        winrate: sim.Winrate
      }
    });
};