/**
 * @author Lukasz Lach
 */

class Templates{

    static getDashboardGameListElement(data){

        const href = "/game?id=" + data._id;

        return (
            `<a href=${href}>` +
                '<div class="dashboard-list-item">' +
                    `<p>White: ${data.white}</p>` +
                    `<p>Black: ${data.black ? data.black : 'waiting for other player...'}</p>` +
                '</div>' +
            '</a>'
        )
    }
}

export default Templates