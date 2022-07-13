export const findNextMucic = (baseMusicList, currentMusic) => {
    // const index = baseMusicList.findIndex((el) => el.id === currentMusic.id) + 1
    // if (index === 0) {
    //     return -1
    // } else if (index >= baseMusicList.length) {
    //     return index - 1
    // } else {
    //     return index
    // }
    if (baseMusicList.length - 1 <= currentMusic.musicIndex) {
        return 0
    }
    return Number(currentMusic.musicIndex) + 1
}
export const findBeforeMusic = (baseMusicList, currentMusic) => {
    if (currentMusic.musicIndex === 0) {
        return baseMusicList.length - 1
    }
    return Number(currentMusic.musicIndex) - 1
}
export const makeMusicTime = (time) => {
    let newMin = 0
    let newHour = 0

    if (time >= 60) {
        newHour = Math.floor(time / 60)
        time = time - newHour * 60
    }
    if (time < 10) {
        newMin = '0' + String(time)
    } else {
        newMin = String(time)
    }
    return newHour + ':' + newMin
}
