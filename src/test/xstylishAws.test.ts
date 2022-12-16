import { _private as target } from "../content_all/on_create/xstylishconfigs/xstylishAws"

test("pad0_2: 1桁数値は左に0を1つ付ける。マイナス値や3桁が引数に与えられることは想定していない", () => {
    expect(target.pad0_2(0)).toBe("00")
    expect(target.pad0_2(9)).toBe("09")
    expect(target.pad0_2(10)).toBe("10")
    expect(target.pad0_2(-5)).toBe("0-5") // マイナス値はない前提なので残念な結果に
    expect(target.pad0_2(456)).toBe("456")
})
