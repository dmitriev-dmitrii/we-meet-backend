
 const meetStorage = new Map()

export const meetService = {

    createMeet : async ()=> {

        const meetId =  Math.floor(Math.random() * 1000);

        if (meetStorage.has(meetId)) {
            return await  this.createMeet()
        }

        const meet = {
            meetId
        }

        meetStorage.set( meetId , meet )

        return  meet
    }

}