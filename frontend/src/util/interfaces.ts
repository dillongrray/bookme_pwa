export type queueDetails = {
    item_id: number,
    item_name: string
}

export type queueData = {
    queue_key: string,
    queue_action: string,
    queue_details: queueDetails
}

export type queueStatus = {
    queue_name: string,
    queue_action: string,
    queue_status: string,
    queue_error: string
}

export const baseQueueData: Array<queueData> = []

export const baseQueueAction: queueData = {
    queue_key: "",
    queue_action: "",
    queue_details: {
        item_id: -1,
        item_name: ""
    }
}


export type errorType = {
    show: boolean,
    message: string
}
