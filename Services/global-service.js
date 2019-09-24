

class GlobalService {

    static pageInformation(list, count) {
        let pageInfo = {}
        if (list.length > 0) {
            pageInfo = {
                next: list[list.length - 1].id,
                previous: list[0].id,
                totalCount: count
            }
        } else {
            pageInfo = {
                totalCount: count
            }
        }

        return pageInfo
    }

}

module.exports = GlobalService