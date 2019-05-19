import fares from '../data/fares.json';


export const getDestinations = (req, res) => {
    let { deals } = fares;
     let destinations=[...new Set(deals.map((deal) =>deal.departure))].map((deal,index)=>{ return { label: deal, value: deal,key:index } });
    res.send({ status: 'success', data:destinations})
}

export const getFares = (req, res) => {
    let { from, to, fareType } = req.body;
    let { deals } = fares;
    let arrivals = deals.filter((item) => item.arrival === to);
    let direct = arrivals.filter((deal) => deal.arrival === to && deal.departure === from);
    if (direct.length > 0) {


        direct= direct.map((path)=>{
            let pathCopy=path;
            let finalCost=path.cost-(path.cost*path.discount/100);
            let timeInMinutes=Number(path.duration.h)*60+Number(path.duration.m);
            path.finalCost=finalCost;
            return {path:[path],cost: finalCost,
                time:timeInMinutes};
        });
        deals = deals.filter(function (e) {
            return !direct.some(function (s) {
                return s.reference === e.reference;
            });
        });
    }
    let inDirect = arrivals.filter((deal) => deal.arrival === to && deal.departure !== from);
    let foundDeals = [];
    if (inDirect.length > 0) {
        deals = deals.filter(function (e) {
            return !inDirect.some(function (s) {
                return s.reference === e.reference;
            });
        });
        arrivals.forEach((item) => {
            if (item) {
                let foundedPaths = findPath(item, deals, []);
                let path='';
                let i=foundedPaths.length-1;
                path=foundedPaths[i].departure;
                while(path!==from && foundedPaths.length>0){
                    path=foundedPaths[i].departure;
                    i--;
                    foundedPaths.pop();
                }
                if(foundedPaths.length >0){
                    foundedPaths= foundedPaths.map((path)=>{
                        let pathCopy=path;
                        pathCopy.finalCost=path.cost-(path.cost*path.discount/100);
                        pathCopy.timeInMinutes=Number(path.duration.h)*60+Number(path.duration.m);

                        return pathCopy;
                    });
                    foundedPaths = foundedPaths.reduce((accumulator, current) => {
                        let itemToPush=current;
                        if (! accumulator.find((prev) =>{
                            if(prev.departure === current.departure || prev.arrival === current.arrival){
                                if(fareType==='cheap'){
                                    if(prev.finalCost<current.finalCost){
                                        itemToPush=prev;
                                        
                                    }else{
                                        itemToPush=current;

                                    }
                                }
                                if(fareType==='fast'){
                                    if(prev.timeInMinutes > current.timeInMinutes){
                                        itemToPush=prev;

                                    }else{
                                        itemToPush=current;

                                    }
                                }
                                return true;
                            }
                        })) {
                            accumulator.push(itemToPush);
                        }
                        return accumulator;
                      }, []);
                     let totalCost= foundedPaths.reduce((prev,current)=>{
                         return prev.finalCost+current.finalCost;
                      });
                      let totalTime= foundedPaths.reduce((prev,current)=>{
                        return prev.timeInMinutes+current.timeInMinutes;
                     });
                    foundDeals.push({
                        path:foundedPaths.reverse(),
                        cost:totalCost,
                        time:totalTime
                    } );
                }
            }
        });
    }
    function findPath(deal, deals, paths) {
        paths.push(deal);
        let prevDest = deals.filter((item) => item.arrival === deal.departure && item.departure !== deal.arrival);
        deals = deals.filter(item => item.reference === deal.reference);
        deals = deals.filter(function (e) {
            return !prevDest.some(function (s) {
                return s.reference === e.reference;
            });
        });
        if (prevDest.length < 1) {
            return paths;
        } else {
            prevDest.forEach((item) => {
                findPath(item, deals, paths);
            });
        }
        return paths;
    }
    foundDeals = [...foundDeals, ...direct ];
    if(fareType==='cheap'){
        foundDeals.sort((a,b)=>a.cost-b.cost);
    }
    if(fareType==='fast'){
        foundDeals.sort((a,b)=>a.time-b.time);
    }
    foundDeals= foundDeals.map((deal)=>{
        let hours = (deal.time / 60);
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);
        return {...deal,detailedTime:{h:rhours,m:rminutes}}
        
    })
    res.send({data:foundDeals.length>0? foundDeals[0]:{}})
}