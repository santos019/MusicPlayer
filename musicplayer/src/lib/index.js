export const findNextMusic = (baseMusicList, currentMusic) => {
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
