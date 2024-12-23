// 定数
const SPOTIFY_API_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_REDIRECT_URL = `${location.protocol}//${location.host}/api-callback/`

// ランダム文字列生成
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// ハッシュ値生成
const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

// BASE64 エンコーディング
const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const localStorageKeys = ['client_id', 'access_token', 'expires_in', 'refresh_token']

// ローカルストレージから指定名の値を取得する
export const getValues = (keys=null) => {
    if (! keys) keys = localStorageKeys
    if (keys.filter(item => ! localStorageKeys.includes(item)).length) {
        throw new Error('ローカルストレーキのキーが不当です。')
    }
    const values = {}
    keys.forEach((key) => {
        values[key] = localStorage.getItem(key)
    })
    return values
}

// ローカルストレージに指定キーの値を保存する
export const setValues = (values) => {
    const keys = Object.keys(values)
    if (keys.filter(item => ! localStorageKeys.includes(item)).length) {
        throw new Error('ローカルストレーキのキーが不当です。')
    }
    keys.forEach((key) =>  {
        localStorage.setItem(key, values[key])
    })
    return true
}

// Spotify API 認可コードを取得する
export const getAuthorizationCode = async () => {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);

    const config = getValues()
    const scope = 'user-read-private user-read-email';
    const authUrl = new URL("https://accounts.spotify.com/authorize")
    window.localStorage.setItem('code_verifier', codeVerifier);
    const params = {
        response_type: 'code',
        client_id: config.client_id,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: SPOTIFY_REDIRECT_URL,
    }

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

// 認可コードと引き換えにアクセストークンを取得する
export const getAccessToken = async (code) => {

    // stored in the previous step
    let codeVerifier = localStorage.getItem('code_verifier');
    const client_id = localStorage.getItem('client_id');
  
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id,
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URL,
        code_verifier: codeVerifier,
      }),
    }
  
    const body = await fetch(SPOTIFY_API_TOKEN_URL, payload);
    const response = await body.json();
  
    setValues({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_in: response.expires_in,
    })

    return response.access_token
}

// アクセストークンを更新する
export const refreshAccessToken = async () => {
  
    const config = getValues()
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: config.refresh_token,
        client_id: config.client_id,
      }),
    }
  
    const response = await fetch(SPOTIFY_API_TOKEN_URL, payload);
    const data = await response.json();
  
    setValues({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
    })

    return response.access_token
}

// API をコールしてレスポンスデータを返す
export const invokeApi = async (path) => {
    for (let n=0; n<2; n++) {
        const payload = {
            headers: {
                Authorization: 'Bearer ' + getValues().access_token
            }
        }
        try {
            const response = await fetch('https://api.spotify.com/v1' + path, payload)
            if (n === 0 && response.status === 401) {
                await refreshAccessToken()
                continue
            }
            else if (response.status !== 200) {
                return null
            }
            const data = await response.json();
            return data
        }
        catch (err) {
            console.error(err)
            return null
        }
    }
}

// アルバム情報を問い合せる
export const queryAlbum = async (albumId) => {
    const data = await invokeApi('/albums/' + albumId)
    // 取り切れていないトラック情報を追加で取得
    for (let n=0; n<10; n++) {
        if (! data || data.tracks.items.length >= data.total_tracks) break
        const path = `/albums/${albumId}/tracks?limit=50&offset=${data.tracks.items.length}`
        const tracks_data = await invokeApi(path)
        data.tracks.items.push(...tracks_data.items)
    }
    return data
}

// トラック情報を問い合せる
export const queryTrack = async (trackId) => {
    const data = await invokeApi('/tracks/' + trackId)
    return data
}

// 一時記憶情報を保存する
export const pushTemporaryMemory = (k, v) => {
    sessionStorage.setItem(k, v)
    return true
}

// 一時記憶情報を取り出す
export const popTemporaryMemory = (k) => {
    const v = sessionStorage.getItem(k)
    if (v) {
        sessionStorage.removeItem(k)
    }
    return v
}
