'''
Business: Upload and store images from admin panel
Args: event - dict with httpMethod, body (base64 image data)
      context - object with request_id
Returns: HTTP response with image URL
'''

import json
import base64
import uuid
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_str = event.get('body', '{}')
    if not body_str or body_str.strip() == '':
        body_str = '{}'
    
    body_data = json.loads(body_str)
    
    if 'image' not in body_data or 'filename' not in body_data:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Missing image or filename'})
        }
    
    image_base64 = body_data['image']
    original_filename = body_data['filename']
    
    if ',' in image_base64:
        image_base64 = image_base64.split(',')[1]
    
    try:
        image_data = base64.b64decode(image_base64)
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Invalid base64 data: {str(e)}'})
        }
    
    file_ext = original_filename.split('.')[-1] if '.' in original_filename else 'jpg'
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    
    upload_dir = '/tmp/uploads'
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, unique_filename)
    
    with open(file_path, 'wb') as f:
        f.write(image_data)
    
    image_url = f"/uploads/{unique_filename}"
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'url': image_url,
            'filename': unique_filename,
            'size': len(image_data)
        })
    }