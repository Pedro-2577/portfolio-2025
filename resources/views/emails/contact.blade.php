<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nuevo mensaje de contacto</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .field {
            margin-bottom: 20px;
        }
        .label {
            font-weight: bold;
            color: #555;
            display: block;
            margin-bottom: 5px;
        }
        .value {
            background: white;
            padding: 10px;
            border-radius: 4px;
            border-left: 4px solid #667eea;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Nuevo mensaje de contacto</h1>
        <p>Portfolio 2025</p>
    </div>
    
    <div class="content">
        <div class="field">
            <span class="label">Nombre:</span>
            <div class="value">{{ $name }}</div>
        </div>
        
        <div class="field">
            <span class="label">Email:</span>
            <div class="value">{{ $email }}</div>
        </div>
        
        <div class="field">
            <span class="label">Asunto:</span>
            <div class="value">{{ $subject }}</div>
        </div>
        
        <div class="field">
            <span class="label">Mensaje:</span>
            <div class="value" style="white-space: pre-line;">{{ $message }}</div>
        </div>
    </div>
    
    <div class="footer">
        <p>Este mensaje fue enviado desde el formulario de contacto de Portfolio 2025</p>
        <p>Fecha: {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>
</body>
</html>
