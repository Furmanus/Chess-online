/**
 * @author Lukasz Lach
 */

import xssFilters from "xss-filters";

class Templates{

    static getDashboardGameListElement(data, user){

        const href = "/game?id=" + data._id + "&user=" + user;

        return (
            `<a href=${href}>` +
                '<div class="dashboard-list-item">' +
                    `<p>White: ${xssFilters.inHTMLData(data.white)}</p>` +
                    `<p>${data.black ? 'Black: ' + xssFilters.inHTMLData(data.black) : 'Waiting for other player...'}</p>` +
                '</div>' +
            '</a>'
        )
    }
    static getDashboardSliderMenuListElement(data){

        return (
            '<div class="dashboard-slider-item">' +
                `<p>Opponent: ${xssFilters.inHTMLData(data.white)}</p>` +
                `<p><a href="#">${'Click to join now'}</a></p>` +
                `<p>Id: ${data._id}</p>` +
            '</div>'
        )
    }
    static getDashboardEmptySliderMenuListElement(){

        return (
            '<div class="dashboard-slider-item">' +
                `<p style="font-size: 24px">No games available at the moment</p>` +
            '</div>'
        )
    }
}

export default Templates;