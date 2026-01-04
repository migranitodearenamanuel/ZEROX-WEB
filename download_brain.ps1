# Script de Descarga del Modelo ZEROX (Phi-3 Mini)
# Este script descarga los pesos necesarios para ejecutar la IA en local.

$BaseUrl = "https://huggingface.co/mlc-ai/Phi-3-mini-4k-instruct-q4f16_1-MLC/resolve/main/"
$DestDir = "c:\Users\manue\OneDrive\Escritorio\ZEROXBOT\zerox-web\assets\brain\Phi-3-mini-4k-instruct-q4f16_1-MLC"

# Lista de archivos requeridos para WebLLM
$Files = @(
    "mlc-chat-config.json",
    "ndarray-cache.json",
    "tokenizer.json",
    "tokenizer_config.json",
    "params_shard_0.bin",
    "params_shard_1.bin",
    "params_shard_2.bin",
    "params_shard_3.bin",
    "params_shard_4.bin",
    "params_shard_5.bin",
    "params_shard_6.bin",
    "params_shard_7.bin",
    "params_shard_8.bin",
    "params_shard_9.bin",
    "params_shard_10.bin",
    "params_shard_11.bin",
    "params_shard_12.bin",
    "params_shard_13.bin",
    "params_shard_14.bin",
    "params_shard_15.bin",
    "params_shard_16.bin",
    "params_shard_17.bin"
)

Write-Host "Iniciando descarga de ZEROX Brain (Phi-3)..." -ForegroundColor Cyan
Write-Host "Destino: $DestDir" -ForegroundColor Gray

if (!(Test-Path -Path $DestDir)) {
    New-Item -ItemType Directory -Path $DestDir | Out-Null
}

foreach ($File in $Files) {
    $Url = "$BaseUrl$File"
    $Output = Join-Path $DestDir $File
    
    if (Test-Path $Output) {
        Write-Host "  [OK] $File ya existe." -ForegroundColor Green
    } else {
        Write-Host "  [..] Descargando $File..." -NoNewline
        try {
            Invoke-WebRequest -Uri $Url -OutFile $Output -UseBasicParsing
            Write-Host " HECHO" -ForegroundColor Green
        } catch {
            Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`nDescarga Completada. El cerebro está en local." -ForegroundColor Cyan
