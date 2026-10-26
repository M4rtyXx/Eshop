document.addEventListener('DOMContentLoaded', async () => {

    window.showToast = function(message, isError = false) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : ''}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 3000);
    };

    const productsDatabase = {
        p1: {
            name: 'Artikulovaný drak',
            priceNoVat: 412,
            image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTQwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iI2I5ZThjYyIvPjxzdG9wIG9mZnNldD0iLjUiIHN0b3AtY29sb3I9IiM2ZWE5OGEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyNzVjNDgiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiI+PHN0b3Agc3RvcC1jb2xvcj0iIzUwNWI1OSIvPjxzdG9wIG9mZnNldD0iLjU1IiBzdG9wLWNvbG9yPSIjMjIyYzI5Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzg4NTdlIi8+PC9saW5lYXJHcmFkaWVudD48cGF0dGVybiBpZD0ibGluZXMiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDRoNSIgc3Ryb2tlPSIjMTczYzJjIiBzdHJva2Utb3BhY2l0eT0iLjE2Ii8+PC9wYXR0ZXJuPjxmaWx0ZXIgaWQ9ImJsdXIiPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEzIi8+PC9maWx0ZXI+PC9kZWZzPjxlbGxpcHNlIGN4PSIzMjAiIGN5PSI0NDUiIHJ4PSIxNjYiIHJ5PSIyMiIgZmlsbD0iIzE4MmIyMCIgb3BhY2l0eT0iLjEyIiBmaWx0ZXI9InVybCgjYmx1cikiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDAgMzMwLjApIHJvdGF0ZSgtMzUpIj48ZWxsaXBzZSByeD0iMzYiIHJ5PSI0NCIgZmlsbD0idXJsKCNnKSIvPjxwYXRoIGQ9Ik0tMjUgLTE4TDAgLTYyIDI1IC0xOCIgZmlsbD0iIzgwYjc5NyIvPjxlbGxpcHNlIHJ4PSIzNiIgcnk9IjQ0IiBmaWxsPSJ1cmwoI2xpbmVzKSIvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxODIgMjg3Ljc2NTE4ODI4MzI4MjQpIHJvdGF0ZSgtMjMpIj48ZWxsaXBzZSByeD0iMzYiIHJ5PSI0NCIgZmlsbD0idXJsKCNnKSIvPjxwYXRoIGQ9Ik0tMjUgLTE4TDAgLTYyIDI1IC0xOCIgZmlsbD0iIzgwYjc5NyIvPjxlbGxpcHNlIHJ4PSIzNiIgcnk9IjQ0IiBmaWxsPSJ1cmwoI2xpbmVzKSIvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMjQgMjU2LjY5NTY0MDY4NDMxNjIzKSByb3RhdGUoLTExKSI+PGVsbGlwc2Ugcng9IjM2IiByeT0iNDQiIGZpbGw9InVybCgjZykiLz48cGF0aCBkPSJNLTI1IC0xOEwwIC02MiAyNSAtMTgiIGZpbGw9IiM4MGI3OTciLz48ZWxsaXBzZSByeD0iMzYiIHJ5PSI0NCIgZmlsbD0idXJsKCNsaW5lcykiLz48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjY2IDI0NS4wMDQ5NTM3ODA0NTI4Nykgcm90YXRlKDEpIj48ZWxsaXBzZSByeD0iMzYiIHJ5PSI0NCIgZmlsbD0idXJsKCNnKSIvPjxwYXRoIGQ9Ik0tMjUgLTE4TDAgLTYyIDI1IC0xOCIgZmlsbD0iIzgwYjc5NyIvPjxlbGxpcHNlIHJ4PSIzNiIgcnk9IjQ0IiBmaWxsPSJ1cmwoI2xpbmVzKSIvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMDggMjU1Ljc4MzY5Njc0MTg2MTEpIHJvdGF0ZSgxMykiPjxlbGxpcHNlIHJ4PSIzNiIgcnk9IjQ0IiBmaWxsPSJ1cmwoI2cpIi8+PHBhdGggZD0iTS0yNSAtMThMMCAtNjIgMjUgLTE4IiBmaWxsPSIjODBiNzk3Ii8+PGVsbGlwc2Ugcng9IjM2IiByeT0iNDQiIGZpbGw9InVybCgjbGluZXMpIi8+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM1MCAyODYuMTgyMzgzMzk1MTc1NSkgcm90YXRlKDI1KSI+PGVsbGlwc2Ugcng9IjM2IiByeT0iNDQiIGZpbGw9InVybCgjZykiLz48cGF0aCBkPSJNLTI1IC0xOEwwIC02MiAyNSAtMTgiIGZpbGw9IiM4MGI3OTciLz48ZWxsaXBzZSByeD0iMzYiIHJ5PSI0NCIgZmlsbD0idXJsKCNsaW5lcykiLz48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzkyIDMyOC4xNjQ3NjcwNjMyODE4Mykgcm90YXRlKDM3KSI+PGVsbGlwc2Ugcng9IjM2IiByeT0iNDQiIGZpbGw9InVybCgjZykiLz48cGF0aCBkPSJNLTI1IC0xOEwwIC02MiAyNSAtMTgiIGZpbGw9IiM4MGI3OTciLz48ZWxsaXBzZSByeD0iMzYiIHJ5PSI0NCIgZmlsbD0idXJsKCNsaW5lcykiLz48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDM0IDM3MC42MzIzMTU5MjE1MDQxMykgcm90YXRlKDQ5KSI+PGVsbGlwc2Ugcng9IjM2IiByeT0iNDQiIGZpbGw9InVybCgjZykiLz48cGF0aCBkPSJNLTI1IC0xOEwwIC02MiAyNSAtMTgiIGZpbGw9IiM4MGI3OTciLz48ZWxsaXBzZSByeD0iMzYiIHJ5PSI0NCIgZmlsbD0idXJsKCNsaW5lcykiLz48L2c+PHBhdGggZD0iTTQ0NyAyODdsNDgtNDMgNDMgMTkgMjMgNTUtMzAgMjctNTgtMTJ6IiBmaWxsPSJ1cmwoI2cpIi8+PHBhdGggZD0iTTQ4MSAyNThsLTQtNDAgMjUgMjRNNTE4IDI1OGwxNS0zNyA4IDUyIiBmaWxsPSIjNDc3ODViIi8+PGNpcmNsZSBjeD0iNTIwIiBjeT0iMjg4IiByPSI2IiBmaWxsPSIjMTczYjJjIi8+PC9zdmc+',
            desc: 'Plně ohebná, detailně propracovaná figurka draka vytištěná na moderní 3D tiskárně. Skvělý jako antistresová hračka nebo jedinečná dekorace na pracovní stůl.',
            colors: ['Neonově Zelená', 'Matná Černá', 'Ohnivá Červená', 'Duhová (Rainbow)'],
            materials: ['PLA (Ekologický plast)']
        },
        p2: {
            name: 'Stojánek na ovladač',
            priceNoVat: 247,
            image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTQwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iI2I5ZThjYyIvPjxzdG9wIG9mZnNldD0iLjUiIHN0b3AtY29sb3I9IiM2ZWE5OGEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyNzVjNDgiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiI+PHN0b3Agc3RvcC1jb2xvcj0iIzUwNWI1OSIvPjxzdG9wIG9mZnNldD0iLjU1IiBzdG9wLWNvbG9yPSIjMjIyYzI5Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzg4NTdlIi8+PC9saW5lYXJHcmFkaWVudD48cGF0dGVybiBpZD0ibGluZXMiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDRoNSIgc3Ryb2tlPSIjMTczYzJjIiBzdHJva2Utb3BhY2l0eT0iLjE2Ii8+PC9wYXR0ZXJuPjxmaWx0ZXIgaWQ9ImJsdXIiPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEzIi8+PC9maWx0ZXI+PC9kZWZzPjxlbGxpcHNlIGN4PSIzMjAiIGN5PSI0NDUiIHJ4PSIxNjYiIHJ5PSIyMiIgZmlsbD0iIzE4MmIyMCIgb3BhY2l0eT0iLjEyIiBmaWx0ZXI9InVybCgjYmx1cikiLz48cGF0aCBkPSJNMjE3IDQyMWw2Ni0xODloNjNsNjYgMTg5eiIgZmlsbD0idXJsKCNiKSIvPjxlbGxpcHNlIGN4PSIzMTUiIGN5PSI0MjIiIHJ4PSIxMjYiIHJ5PSIyMiIgZmlsbD0idXJsKCNiKSIvPjxwYXRoIGQ9Ik0xNzcgMTkzcTE0LTQ1IDU3LTI4bDQwIDE0aDg3bDQxLTE0cTQyLTE1IDU1IDI4bDMyIDk4cTkgMzctMTkgNDQtMTYgMy0zNy0yNWwtMjQtMzBIMjQ5bC0yNSAzMHEtMjMgMjktNDEgMjItMjUtOS0xNi00NHoiIGZpbGw9IiNlN2ViZTciIHN0cm9rZT0iI2M3ZDBjOCIgc3Ryb2tlLXdpZHRoPSIzIi8+PHBhdGggZD0iTTIxNiAyMDF2NDhtLTI0LTI0aDQ4IiBzdHJva2U9IiM0MjRiNDYiIHN0cm9rZS13aWR0aD0iMTIiLz48Y2lyY2xlIGN4PSIyODkiIGN5PSIyNTQiIHI9IjIwIiBmaWxsPSIjNGE1MzRlIi8+PGNpcmNsZSBjeD0iMzY5IiBjeT0iMjU0IiByPSIyMCIgZmlsbD0iIzRhNTM0ZSIvPjxjaXJjbGUgY3g9IjQxMCIgY3k9IjIwNCIgcj0iNyIgZmlsbD0iIzc0OGE3YyIvPjxjaXJjbGUgY3g9IjQyNyIgY3k9IjIyMiIgcj0iNyIgZmlsbD0iIzc0OGE3YyIvPjxjaXJjbGUgY3g9IjM5MyIgY3k9IjIyMiIgcj0iNyIgZmlsbD0iIzc0OGE3YyIvPjxjaXJjbGUgY3g9IjQxMCIgY3k9IjI0MCIgcj0iNyIgZmlsbD0iIzc0OGE3YyIvPjwvc3ZnPg==',
            desc: 'Univerzální, robustní stojánek navržený pro herní ovladače Xbox Series, PlayStation 5 nebo Nintendo Switch. Udržujte svůj herní koutek perfektně organizovaný.',
            colors: ['Matná Černá', 'Polární Bílá', 'Stříbrná'],
            materials: ['PLA (Základní)', 'PETG (Zvýšená odolnost)']
        },
        p3: {
            name: 'Květináč Groot',
            priceNoVat: 289,
            image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTQwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iI2I5ZThjYyIvPjxzdG9wIG9mZnNldD0iLjUiIHN0b3AtY29sb3I9IiM2ZWE5OGEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyNzVjNDgiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiI+PHN0b3Agc3RvcC1jb2xvcj0iIzUwNWI1OSIvPjxzdG9wIG9mZnNldD0iLjU1IiBzdG9wLWNvbG9yPSIjMjIyYzI5Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzg4NTdlIi8+PC9saW5lYXJHcmFkaWVudD48cGF0dGVybiBpZD0ibGluZXMiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDRoNSIgc3Ryb2tlPSIjMTczYzJjIiBzdHJva2Utb3BhY2l0eT0iLjE2Ii8+PC9wYXR0ZXJuPjxmaWx0ZXIgaWQ9ImJsdXIiPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEzIi8+PC9maWx0ZXI+PC9kZWZzPjxlbGxpcHNlIGN4PSIzMjAiIGN5PSI0NDUiIHJ4PSIxNjYiIHJ5PSIyMiIgZmlsbD0iIzE4MmIyMCIgb3BhY2l0eT0iLjEyIiBmaWx0ZXI9InVybCgjYmx1cikiLz48cGF0aCBkPSJNMjE2IDE2OWwzNCAyOSA5LTU3IDQzIDQ3IDIyLTUyIDI3IDUxIDM2LTQ3IDkgNTAgMzUtMjMtMTkgMjMzcS04MyA1MC0xNzEtMXoiIGZpbGw9IiNiYjk1NzQiLz48ZWxsaXBzZSBjeD0iMzIyIiBjeT0iMjAwIiByeD0iOTkiIHJ5PSIyNSIgZmlsbD0iIzYyNDkzNSIvPjxwYXRoIGQ9Ik0zMjIgMjAwcS04LTEwMCA3Ny0xMDktMTIgNzEtNzcgMTA5TTMyMCAxOTdxLTgwLTE5LTY2LTkxIDcxIDEwIDY2IDkxIiBmaWxsPSIjNmI5YTcwIi8+PHBhdGggZD0iTTI0NyAyMzhsMTAgMTU3bTM0LTE1Ny01IDE4MW02NS0xODYtNSAxODVtNDUtMTg2LTE1IDE3MyIgc3Ryb2tlPSIjOWU3NjU5IiBzdHJva2Utd2lkdGg9IjgiLz48ZWxsaXBzZSBjeD0iMjgwIiBjeT0iMzAzIiByeD0iMTUiIHJ5PSIxOSIgZmlsbD0iIzM4MmIyMSIvPjxlbGxpcHNlIGN4PSIzNjciIGN5PSIzMDMiIHJ4PSIxNSIgcnk9IjE5IiBmaWxsPSIjMzgyYjIxIi8+PHBhdGggZD0iTTMwMSAzNDVxMjIgMjAgNDMtMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjI0NzM1IiBzdHJva2Utd2lkdGg9IjYiLz48L3N2Zz4=',
            desc: 'Stylový květináč inspirovaný populární filmovou postavou. Ideální pro malé sukulenty, kaktusy, nebo může posloužit jako originální stojan na tužky.',
            colors: ['Dřevěná Hnědá', 'Mramorová (Marble)', 'Kamenná Šedá'],
            materials: ['PLA (Ekologický plast)']
        },
        p4: {
            name: 'Stojánek na sluchátka',
            priceNoVat: 190,
            image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTQwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iI2I5ZThjYyIvPjxzdG9wIG9mZnNldD0iLjUiIHN0b3AtY29sb3I9IiM2ZWE5OGEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyNzVjNDgiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiI+PHN0b3Agc3RvcC1jb2xvcj0iIzUwNWI1OSIvPjxzdG9wIG9mZnNldD0iLjU1IiBzdG9wLWNvbG9yPSIjMjIyYzI5Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzg4NTdlIi8+PC9saW5lYXJHcmFkaWVudD48cGF0dGVybiBpZD0ibGluZXMiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDRoNSIgc3Ryb2tlPSIjMTczYzJjIiBzdHJva2Utb3BhY2l0eT0iLjE2Ii8+PC9wYXR0ZXJuPjxmaWx0ZXIgaWQ9ImJsdXIiPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEzIi8+PC9maWx0ZXI+PC9kZWZzPjxlbGxpcHNlIGN4PSIzMjAiIGN5PSI0NDUiIHJ4PSIxNjYiIHJ5PSIyMiIgZmlsbD0iIzE4MmIyMCIgb3BhY2l0eT0iLjEyIiBmaWx0ZXI9InVybCgjYmx1cikiLz48ZWxsaXBzZSBjeD0iMzIwIiBjeT0iNDIxIiByeD0iMTI0IiByeT0iMjYiIGZpbGw9InVybCgjYikiLz48cGF0aCBkPSJNMzAwIDQxNVYxNzJxMjAtMjYgNDAgMHYyNDMiIGZpbGw9InVybCgjYikiLz48cGF0aCBkPSJNMjUwIDE4MnE3MC0zNyAxNDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNTk2ODVlIiBzdHJva2Utd2lkdGg9IjMwIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjEzIDI5MVYyMjlhMTA3IDEwNyAwIDAxMjE0IDB2NjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM1M2UzOCIgc3Ryb2tlLXdpZHRoPSIyOSIvPjxwYXRoIGQ9Ik0yMTEgMjc5djY0bTIxNy02NHY2NCIgc3Ryb2tlPSIjNzc4NjdiIiBzdHJva2Utd2lkdGg9IjQ0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=',
            desc: 'Elegantní stojan s minimalistickým designem, který bezpečně udrží jakákoliv náhlavní sluchátka. Konstrukce zamezuje deformaci hlavového mostu.',
            colors: ['Matná Černá', 'Polární Bílá', 'Kybernetická Zelená'],
            materials: ['PETG (Zvýšená odolnost)', 'ABS (Technický plast)']
        }
    };

    async function api(path, options = {}) {
        const response = await fetch(path, {...options, signal: AbortSignal.timeout(60000)});
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Požadavek se nepodařilo uložit. Zkuste to znovu.');
        return data;
    }
    let backendReady = false;
    try {
        const response = await fetch('/api/products', {signal: AbortSignal.timeout(5000)});
        if (!response.ok) throw new Error('Catalog unavailable');
        const {products} = await response.json();
        products.forEach(product => { if(productsDatabase[product.id]) Object.assign(productsDatabase[product.id], product); });
        backendReady = true;
    } catch {
        const banner = document.createElement('p'); banner.className = 'service-notice';
        banner.textContent = 'Objednávkový systém je momentálně nedostupný. Zkuste stránku obnovit později.';
        document.querySelector('main').prepend(banner);
    }

    function submissionKey(form, body) {
        const signature = typeof body === 'string' ? body : JSON.stringify(body);
        if (form.dataset.signature !== signature) { form.dataset.signature = signature; form.dataset.requestKey = crypto.randomUUID(); }
        return form.dataset.requestKey;
    }

    document.querySelectorAll('.price-container').forEach(container => {
        const prodId = container.getAttribute('data-product-id');
        const product = productsDatabase[prodId];
        if (product) {
            const vatPrice = (product.price_cents != null ? product.price_cents / 100 : Math.round(product.priceNoVat * 1.21));
            container.innerHTML = `
                <p class="price-no-vat">Cena: ${product.priceNoVat} Kč bez DPH</p>
                <p class="price-vat">${vatPrice} Kč s DPH</p>
            `;
        }
    });

    const detailContainer = document.getElementById('product-detail-container');
    if (detailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const product = productsDatabase[productId];

        if (product) {
            const breadcrumbs = document.getElementById('breadcrumbs');
            const bcProductName = document.getElementById('bc-product-name');
            if (breadcrumbs && bcProductName) {
                bcProductName.textContent = product.name;
                breadcrumbs.style.display = 'block';
            }

            const vatPrice = (product.price_cents != null ? product.price_cents / 100 : Math.round(product.priceNoVat * 1.21));
            let colorOptions = '';
            product.colors.forEach(c => colorOptions += `<option value="${c}">${c}</option>`);
            let materialOptions = '';
            product.materials.forEach(m => materialOptions += `<option value="${m}">${m}</option>`);

            detailContainer.innerHTML = `
                <div class="detail-image"><span class="detail-caption">Ilustrační vizualizace</span>
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="detail-info"><p class="eyebrow">P&P COLLECTION</p>
                    <h1>${product.name}</h1>
                    <p class="price-no-vat" style="font-size:1.1rem;">Cena: ${product.priceNoVat} Kč bez DPH</p>
                    <p class="price-vat" style="font-size:2rem; margin-bottom: 20px;">${vatPrice} Kč s DPH</p>
                    <p class="product-desc">${product.desc}</p>
                    
                    <div class="selector-group">
                        <label for="product-color">Vyberte barvu:</label>
                        <select id="product-color">${colorOptions}</select>
                    </div>

                    <div class="selector-group">
                        <label for="product-material">Vyberte materiál:</label>
                        <select id="product-material">${materialOptions}</select>
                    </div>

                    <label class="quantity-label" for="product-quantity">Počet kusů</label><input id="product-quantity" type="number" min="1" max="50" step="1" value="1" required>
                    <button class="btn btn-primary btn-block" id="add-to-cart-detail" style="margin-top: 30px; padding: 15px;">
                        Přidat do košíku  →
                    </button>
                </div>
            `;

            document.getElementById('add-to-cart-detail').addEventListener('click', () => {
                const selectedColor = document.getElementById('product-color').value;
                const selectedMaterial = document.getElementById('product-material').value;
                const quantityInput = document.getElementById('product-quantity');
                if (!quantityInput.reportValidity()) return;
                if (window.addVariantToCart(productId, product.name, product.priceNoVat, product.image, selectedColor, selectedMaterial, Number(quantityInput.value))) {
                    window.showToast(`${product.name} byl přidán do košíku.`);
                    openCart();
                }
            });

        } else {
            detailContainer.innerHTML = `<p style="text-align: center; color: #ff4444; width: 100%; font-size: 1.2rem; font-weight: bold;">Produkt nebyl nalezen.</p>`;
        }
    }

    const choicePro = document.getElementById('choice-pro');
    const choiceLaik = document.getElementById('choice-laik');
    const funnelChoices = document.getElementById('funnel-choices');
    const formPro = document.getElementById('form-pro');
    const formLaik = document.getElementById('form-laik');
    
    if (choicePro && choiceLaik) {
        choicePro.addEventListener('click', () => {
            funnelChoices.style.display = 'none';
            formPro.style.display = 'block';
            formPro.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        choiceLaik.addEventListener('click', () => {
            funnelChoices.style.display = 'none';
            formLaik.style.display = 'block';
            formLaik.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        document.querySelectorAll('.reset-funnel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                formPro.style.display = 'none';
                formLaik.style.display = 'none';
                

                document.getElementById('pro-file-name').textContent = [...document.getElementById('pro-upload').files].map(f => f.name).join(', ') || 'Klikněte pro výběr 3D modelů';
                document.getElementById('laik-file-name').textContent = [...document.getElementById('laik-upload').files].map(f => f.name).join(', ') || 'Nahrát fotky / nákres (Volitelné)';
                
                document.querySelectorAll('.wizard-step').forEach(step => step.style.display = 'none');
                document.getElementById('pro-step-1').style.display = 'block';
                document.getElementById('laik-step-1').style.display = 'block';

                funnelChoices.style.display = 'grid';
                document.getElementById('zakazka').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentStepId = e.target.getAttribute('data-current');
            const nextStepId = e.target.getAttribute('data-next');
            const currentStep = document.getElementById(currentStepId);
            
            const inputs = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
            let valid = true;
            
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity(); 
                    valid = false;
                }
            });

            if (valid) {
                currentStep.style.display = 'none';
                const nextStep = document.getElementById(nextStepId);
                nextStep.style.display = 'block';
                nextStep.querySelector('input,select,textarea,button')?.focus();
            }
        });
    });

    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentStepId = e.target.getAttribute('data-current');
            const prevStepId = e.target.getAttribute('data-prev');
            
            document.getElementById(currentStepId).style.display = 'none';
            document.getElementById(prevStepId).style.display = 'block';
        });
    });

    const proUpload = document.getElementById('pro-upload');
    if (proUpload) {
        proUpload.addEventListener('change', function(e) {
            const nameDisp = document.getElementById('pro-file-name');
            const fileCount = e.target.files.length;
            if (fileCount > 1) {
                nameDisp.textContent = `Vybráno souborů: ${fileCount}`;
                nameDisp.style.color = 'var(--primary-color)';
            } else if (fileCount === 1) {
                nameDisp.textContent = e.target.files[0].name;
                nameDisp.style.color = 'var(--primary-color)';
            } else {
                nameDisp.textContent = 'Klikněte pro výběr 3D modelů';
                nameDisp.style.color = 'inherit';
            }
        });
    }

    const laikUpload = document.getElementById('laik-upload');
    if (laikUpload) {
        laikUpload.addEventListener('change', function(e) {
            const nameDisp = document.getElementById('laik-file-name');
            const fileCount = e.target.files.length;
            if (fileCount > 1) {
                nameDisp.textContent = `Vybráno souborů: ${fileCount}`;
                nameDisp.style.color = 'var(--primary-color)';
            } else if (fileCount === 1) {
                nameDisp.textContent = e.target.files[0].name;
                nameDisp.style.color = 'var(--primary-color)';
            } else {
                nameDisp.textContent = 'Nahrát fotky / nákres (Volitelné)';
                nameDisp.style.color = 'inherit';
            }
        });
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        for(const field of form.querySelectorAll('input,select,textarea')) {
            if(!field.checkValidity()) {
                form.querySelectorAll('.wizard-step').forEach(step=>step.style.display='none');
                field.closest('.wizard-step').style.display='block'; field.reportValidity(); return;
            }
        }
        const fields = new FormData(form);
        const payload = {kind:form.id==='pro-form'?'model':'idea',customer:{name:fields.get('name'),email:fields.get('email')}};
        for(const name of ['description','url','environment','load','dimensions','material','color','quality','infill','website']) {
            if(fields.has(name)) payload[name]=fields.get(name);
        }
        const files=[...form.querySelector('input[type=file]').files];
        if(files.length>3 || files.some(f=>f.size>10*1024*1024||f.size===0)) {showToast('Vyberte nejvýše 3 neprázdné soubory, každý do 10 MB.',true);return;}
        const data=new FormData();data.set('payload',JSON.stringify(payload));files.forEach(f=>data.append('files',f));
        const signature=JSON.stringify(payload)+files.map(f=>f.name+f.size+f.lastModified).join('|');
        const button=form.querySelector('button[type=submit]');button.disabled=true;button.textContent='Odesílám…';
        try {
            const result=await api('/api/enquiries',{method:'POST',headers:{'Idempotency-Key':submissionKey(form,signature)},body:data});
            form.reset();form.querySelector('.reset-funnel').click();delete form.dataset.signature;
            let receipt=document.getElementById('enquiry-receipt');
            if(!receipt){receipt=document.createElement('div');receipt.id='enquiry-receipt';receipt.className='receipt';receipt.setAttribute('role','status');document.getElementById('funnel-choices').before(receipt);}
            receipt.textContent='Poptávka '+result.id+' je uložená. Její číslo si prosím poznamenejte. Podklady nyní čekají na zpracování.';
            receipt.scrollIntoView({behavior:'smooth',block:'center'});
        }catch(error){showToast(error.name==='TimeoutError'?'Odpověď serveru trvá déle. Zkuste odeslat znovu; stejná poptávka se neuloží dvakrát.':error.message,true);}
        finally{button.disabled=false;button.textContent='Odeslat k nacenění';}
    };

    const proForm = document.getElementById('pro-form');
    if (proForm) proForm.addEventListener('submit', handleFormSubmit);
    
    const laikForm = document.getElementById('laik-form');
    if (laikForm) laikForm.addEventListener('submit', handleFormSubmit);

    function updateActiveNav() {
        const path = window.location.pathname;
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => link.classList.remove('active'));

        let activeSelector = null;
        const scrollPos = window.scrollY || window.pageYOffset;

        if (path.includes('eshop.html') || path.includes('produkt.html')) {
            activeSelector = 'nav a[href="eshop.html"]';
        } else {
            activeSelector = 'nav a[href="index.html"]'; 
            const zakazka = document.getElementById('zakazka');
            if (zakazka && scrollPos >= zakazka.offsetTop - 150) {
                activeSelector = 'nav a[href="index.html#zakazka"]';
            }
        }

        const footer = document.getElementById('kontakt');
        if (footer) {
            const footerRect = footer.getBoundingClientRect();
            if (footerRect.top < window.innerHeight - 50) {
                activeSelector = 'nav a[href="#kontakt"]';
            }
        }

        if (activeSelector) {
            const activeLink = document.querySelector(activeSelector);
            if (activeLink) activeLink.classList.add('active');
        }
    }

    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);

    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const targetId = href.split('#')[1];
            
            const isIndex = !window.location.pathname.includes('eshop.html') && !window.location.pathname.includes('produkt.html');
            const isLocalAnchor = href.startsWith('#');
            const isIndexAnchor = href.startsWith('index.html#');

            if ((isIndex && isIndexAnchor) || isLocalAnchor) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    updateActiveNav();
                }
            }
        });
    });

    let cart = [];
    try {
        const saved=JSON.parse(localStorage.getItem('3dprintCart'));
        if(Array.isArray(saved)) cart=saved.filter(i=>{const p=productsDatabase[i.productId];return p&&p.colors.includes(i.color)&&p.materials.includes(i.material)&&Number.isInteger(i.quantity)&&i.quantity>0&&i.quantity<=50;}).map(i=>{
            const p=productsDatabase[i.productId];return {productId:i.productId,cartItemId:`${i.productId}-${i.color.replace(/\s+/g,'')}-${i.material.replace(/\s+/g,'')}`,name:p.name,priceNoVat:p.priceNoVat,image:p.image,color:i.color,material:i.material,quantity:i.quantity};
        });
    } catch {}

    
    const cartBtn = document.getElementById('open-cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    
    const cartCountEl = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartTotalNoVatEl = document.getElementById('cart-total-no-vat');

    function openCart() {
        if(cartSidebar) {cartSidebar.inert=false; cartSidebar.classList.add('open'); closeCartBtn.focus(); document.body.classList.add('cart-open');}
        if(cartOverlay) cartOverlay.classList.add('active');
    }

    function closeCart() {
        if(cartSidebar) {cartSidebar.classList.remove('open'); cartSidebar.inert=true; document.body.classList.remove('cart-open'); cartBtn.focus();}
        if(cartOverlay) cartOverlay.classList.remove('active');
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    function updateCart() {
        try { localStorage.setItem('3dprintCart', JSON.stringify(cart)); } catch {}
        renderCart();
    }

    function renderCart() {
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        let totalNoVat = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-state">
                    <div style="font-size: 3.5rem; margin-bottom: 10px; opacity: 0.5;">🛒</div>
                    <h3 style="margin-bottom: 10px;">Váš košík je prázdný</h3>
                    <p style="color: var(--text-muted); margin-bottom: 25px;">Zatím jste si nic nevybrali. Pojďme to napravit!</p>
                    <a href="eshop.html" class="btn btn-outline btn-block">Přejít do katalogu</a>
                </div>
            `;
        } else {
            cart.forEach(item => {
                totalNoVat += item.priceNoVat * item.quantity;
                count += item.quantity;
                const itemVatPrice = (productsDatabase[item.productId].price_cents != null ? productsDatabase[item.productId].price_cents / 100 : Math.round(item.priceNoVat * 1.21));

                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>${itemVatPrice} Kč s DPH</p>
                        <small>Varianta: ${item.color}, ${item.material}</small>
                        <small style="font-size:0.7rem; color:#777;">Základ bez DPH: ${item.priceNoVat} Kč/ks</small>
                    </div>
                    <div class="item-controls">
                        <button aria-label="Odebrat jeden kus" class="btn-minus" data-cart-id="${item.cartItemId}">-</button>
                        <span>${item.quantity}</span>
                        <button aria-label="Přidat jeden kus" class="btn-plus" data-cart-id="${item.cartItemId}">+</button>
                        <button aria-label="Odstranit položku" class="btn-remove" data-cart-id="${item.cartItemId}">X</button>
                    </div>
                `;
                cartItemsContainer.appendChild(div);
            });
        }

        const totalWithVat = cart.reduce((total,item)=>total+(productsDatabase[item.productId].price_cents != null ? productsDatabase[item.productId].price_cents / 100 : Math.round(item.priceNoVat*1.21))*item.quantity,0);

        const checkoutButton = document.getElementById("checkout-btn");
        if (checkoutButton) checkoutButton.disabled = !cart.length || !backendReady;
        if (cartCountEl) cartCountEl.textContent = count;
        if (cartTotalPriceEl) cartTotalPriceEl.textContent = `${totalWithVat} Kč`;
        if (cartTotalNoVatEl) cartTotalNoVatEl.textContent = `${totalNoVat} Kč`;
    }

    window.addVariantToCart = function(productId, name, priceNoVat, image, color, material, quantity = 1) {
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) return false;
        const cartItemId = `${productId}-${color.replace(/\s+/g, '')}-${material.replace(/\s+/g, '')}`;
        const existingItem = cart.find(i => i.cartItemId === cartItemId);
        
        if (existingItem) {
            if(existingItem.quantity + quantity > 50){showToast('Maximálně 50 kusů jedné varianty.',true);return false;} existingItem.quantity += quantity;
        } else {
            cart.push({ cartItemId, productId, name, priceNoVat, image, color, material, quantity });
        }
        
        updateCart();
        return true;
    };

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const cartItemId = btn.getAttribute('data-cart-id');
            const item = cart.find(i => i.cartItemId === cartItemId);

            if (btn.classList.contains('btn-minus')) {
                if (item) {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(i => i.cartItemId !== cartItemId);
                        window.showToast('Položka odstraněna z košíku.');
                    }
                    updateCart();
                }
            } else if (btn.classList.contains('btn-plus')) {
                if (item) {
                    if(item.quantity>=50){showToast('Maximálně 50 kusů jedné varianty.',true);return;} item.quantity += 1;
                    updateCart();
                }
            } else if (btn.classList.contains('btn-remove')) {
                cart = cart.filter(i => i.cartItemId !== cartItemId);
                window.showToast('Položka odstraněna z košíku.');
                updateCart();
            }
        });
    }

    const checkoutDialog=document.createElement('dialog');checkoutDialog.className='checkout-dialog';
    checkoutDialog.innerHTML=`<form id="checkout-form"><div class="checkout-heading"><h2>Dokončíme to spolu.</h2><button type="button" class="close-btn" aria-label="Zavřít">×</button></div><p>Pošlete nám nezávaznou poptávku vybraných produktů. Dopravu a platbu s vámi domluvíme individuálně.</p><p class="checkout-summary"></p><label>Jméno<input name="name" autocomplete="name" required minlength="2" maxlength="120"></label><label>E-mail<input type="email" name="email" autocomplete="email" required maxlength="254"></label><label>Telefon (volitelné)<input name="phone" type="tel" autocomplete="tel" maxlength="40"></label><label>Poznámka (volitelné)<textarea name="note" rows="3" maxlength="3000"></textarea></label><input name="website" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="form-help">Údaje použijeme k vyřízení poptávky. <a href="soukromi.html">Více o zpracování údajů</a>.</p><p id="checkout-error" role="alert"></p><button type="submit" class="btn btn-primary btn-block">Odeslat nezávaznou poptávku</button></form><div id="order-receipt" hidden role="status"><h2>Děkujeme.</h2><p></p><button type="button" class="btn btn-primary">Zavřít</button></div>`;
    document.body.append(checkoutDialog);
    checkoutDialog.querySelectorAll('button[type=button]').forEach(b=>b.addEventListener('click',()=>checkoutDialog.close()));
    const checkoutForm=checkoutDialog.querySelector('form');
    const receipt=checkoutDialog.querySelector('#order-receipt');
    checkoutForm.addEventListener('submit',async e=>{
        e.preventDefault();if(!cart.length)return;
        const fields=new FormData(checkoutForm);
        const payload={customer:{name:fields.get('name'),email:fields.get('email'),phone:fields.get('phone')},note:fields.get('note'),website:fields.get('website'),items:cart.map(i=>({product_id:i.productId,color:i.color,material:i.material,quantity:i.quantity}))};
        const button=checkoutForm.querySelector('button[type=submit]');button.disabled=true;button.textContent='Odesílám…';
        checkoutForm.querySelector('#checkout-error').textContent='';
        try{
            const result=await api('/api/orders',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':submissionKey(checkoutForm,payload)},body:JSON.stringify(payload)});
            cart=[];updateCart();checkoutForm.reset();delete checkoutForm.dataset.signature;checkoutForm.hidden=true;receipt.hidden=false;
            receipt.querySelector('p').textContent='Poptávka '+result.id+' byla uložená. Cena produktů: '+(result.total_cents/100).toLocaleString('cs-CZ')+' Kč včetně DPH, bez dopravy. Číslo si prosím poznamenejte. Platba zatím neproběhla.';
        }catch(error){checkoutForm.querySelector('#checkout-error').textContent=error.name==='TimeoutError'?'Server neodpověděl včas. Zkuste odeslat znovu; stejný požadavek nevytvoří duplicitní objednávku.':error.message;}
        finally{button.disabled=false;button.textContent='Odeslat nezávaznou poptávku';}
    });
    document.getElementById('checkout-btn').addEventListener('click',()=>{
        if(!cart.length){showToast('Nejprve vyberte produkty do košíku.',true);return;}
        if(!backendReady){showToast('Server není dostupný. Obnovte stránku a zkuste to znovu.',true);return;}
        checkoutForm.hidden=false;receipt.hidden=true;checkoutForm.querySelector('.checkout-summary').textContent='Produkty celkem: '+cart.reduce((n,i)=>n+(productsDatabase[i.productId].price_cents != null ? productsDatabase[i.productId].price_cents / 100 : Math.round(i.priceNoVat*1.21))*i.quantity,0).toLocaleString('cs-CZ')+' Kč včetně DPH. Doprava bude naceněna samostatně.';
        closeCart();checkoutDialog.showModal();
    });

    renderCart(); 

    const grid = document.getElementById('product-grid');
    if (grid) {
        const cards = [...grid.querySelectorAll('.product-card')];
        const buttons = [...document.querySelectorAll('.filter-btn')];
        const search = document.getElementById('catalog-search');
        const sort = document.getElementById('catalog-sort');
        const params = new URLSearchParams(location.search);
        let category = buttons.some(b => b.dataset.filter === params.get('category')) ? params.get('category') : 'all';
        search.value = params.get('q') || '';
        if ([...sort.options].some(o => o.value === params.get('sort'))) sort.value = params.get('sort');
        const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('cs');
        function applyFilters() {
            const query = normalize(search.value.trim());
            let count = 0;
            const getProduct = card => productsDatabase[card.querySelector('[data-product-id]').dataset.productId];
            cards.forEach(card => {
                const product = getProduct(card);
                const haystack = normalize([product.name, product.desc, ...product.colors, ...product.materials].join(' '));
                const visible = (category === 'all' || card.dataset.category === category) && haystack.includes(query);
                card.hidden = !visible;
                if (visible) count++;
            });
            const price = card => getProduct(card).price_cents ?? Math.round(getProduct(card).priceNoVat * 1.21) * 100;
            [...cards].sort((a, b) => sort.value === 'price-asc' ? price(a)-price(b) : sort.value === 'price-desc' ? price(b)-price(a) : sort.value === 'name' ? getProduct(a).name.localeCompare(getProduct(b).name, 'cs') : cards.indexOf(a)-cards.indexOf(b)).forEach(card => grid.append(card));
            buttons.forEach(button => { const active = button.dataset.filter === category; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
            document.getElementById('catalog-count').textContent = `Zobrazeno ${count} z ${cards.length} produktů`;
            document.getElementById('catalog-empty').hidden = count !== 0;
            const url = new URL(location.href);
            for (const [key, value] of Object.entries({category: category === 'all' ? '' : category, q: search.value.trim(), sort: sort.value === 'default' ? '' : sort.value})) {
                if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
            }
            history.replaceState(null, '', url);
        }
        buttons.forEach(button => button.addEventListener('click', () => {category = button.dataset.filter; applyFilters();}));
        search.addEventListener('input', applyFilters);
        sort.addEventListener('change', applyFilters);
        document.getElementById('catalog-reset').addEventListener('click', () => {category='all'; search.value=''; sort.value='default'; applyFilters(); search.focus();});
        applyFilters();
    }

    const menu = document.querySelector('.menu-toggle');
    menu.addEventListener('click', () => {const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('nav').classList.toggle('is-open',open);});
    document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');document.querySelector('nav').classList.remove('is-open');}));
    document.querySelectorAll('.funnel-card,.file-label').forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}}));
    document.addEventListener('keydown', e => {if(e.key==='Escape'){if(cartSidebar.classList.contains('open'))closeCart();document.getElementById('chat-window').classList.remove('active');}if(e.key==='Tab'&&cartSidebar.classList.contains('open')){const list=[...cartSidebar.querySelectorAll('button,a,input')];const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
    const chat=document.getElementById('chat-window'), input=document.getElementById('chat-input'), messages=document.getElementById('chat-messages');
    document.getElementById('chat-toggle-btn').addEventListener('click',()=>{chat.classList.toggle('active');if(chat.classList.contains('active'))input.focus();});
    document.getElementById('close-chat-btn').addEventListener('click',()=>chat.classList.remove('active'));
    function send(){const text=input.value.trim();if(!text)return;const user=document.createElement('div');user.className='chat-msg user-msg';user.textContent=text;messages.append(user);input.value='';const bot=document.createElement('div');bot.className='chat-msg bot-msg';bot.textContent=/pla|petg|asa|tpu|materi/i.test(text)?'PLA se hodí na dekorace, PETG na odolnější doplňky, ASA pro venkovní použití a TPU na pružné díly. Výběr záleží i na teplotě a namáhání.':/cena|zakáz|model|tisk/i.test(text)?'Pro tisk na míru otevřete na hlavní stránce sekci Tisk na zakázku. Můžete vybrat model nebo popsat svůj nápad. Podklady bezpečně uložíme pro individuální nacenění.':'Jsem jednoduchý automatický průvodce. Zkuste dotaz na materiály nebo tisk na zakázku.';messages.append(bot);messages.scrollTop=messages.scrollHeight;}
    document.getElementById('chat-send-btn').addEventListener('click',send);input.addEventListener('keydown',e=>{if(e.key==='Enter')send();});
});
