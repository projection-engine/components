const TARGET_SIZE = 30000000  // 30mb

export default function splitData(data){

    const size =  (new TextEncoder().encode('foo')).length

    let response = [data]

    if(size > TARGET_SIZE)
        response = data.match(new RegExp('.{1,' + TARGET_SIZE + '}', 'g'))

    return response
}