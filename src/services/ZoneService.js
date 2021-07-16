import axios from 'axios';

export class ZoneService {

    getTreeZones() {
        return axios.get(process.env.REACT_APP_CITIES_GENERATOR_URL)
    }
    
    convert(zones) {
    	let convertedZones =  zones.map((e) => {
    		return {
    					key: e.id,
    					data: e.id,
    					label: e.name,
    					icon: 'pi pi-fw pi-cog',
    					children: this.convert(e.zones)
    				}
    	})
    	return convertedZones 
    }
}