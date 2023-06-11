import sha256 from "./crypto-js/sha256.js"
function test(date1,date2,date3,date4,date5){
    var temp1 = []
    temp1.push(date1,date2,date3,date4,date5)
    fuzhi(temp1)
    var temp2 = []
    for (let i = 0; i < temp1.length; i++) {
        temp2.push(jiami1(temp1[i]))
    }
    var temp3 = []
    for (let i = 0; i < temp2.length; i+=2) {
        temp3.push(jiami2(temp2[i]+temp2[i+1]))
    }
    fuzhi(temp3)
    var temp4 = []
    for (let i = 0; i < temp3.length; i+=2) {
        temp4.push(jiami2(temp3[i]+temp3[i+1]))
    }
    return jiami2(temp4[0]+temp4[1])
}
function jiami1(x){
    return sha256(x).toString()
}
function jiami2(x,y){
    return sha256(x+y).toString()
}
function fuzhi(array){
    var count = 0
    for (let i = 0; i < array.length; i++) {
        count+=1
    }
    if (count%2==1){
        array.push(array[array.length-1])
    }
}
function main(){
    console.log(test("123", "456", "789", "234", "764"))
}
main()