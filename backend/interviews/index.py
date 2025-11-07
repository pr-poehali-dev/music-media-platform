'''
Business: CRUD operations for interviews - create, read, update, delete, search
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with request_id
Returns: HTTP response with interview data
'''

import json
import os
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise ValueError('DATABASE_URL not configured')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            interview_id = params.get('id')
            search = params.get('search')
            
            if interview_id:
                cursor.execute(
                    'SELECT * FROM interviews WHERE id = %s',
                    (interview_id,)
                )
                interview = cursor.fetchone()
                
                if not interview:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Interview not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(dict(interview), default=str)
                }
            
            if search:
                cursor.execute(
                    '''SELECT * FROM interviews 
                       WHERE title ILIKE %s OR content ILIKE %s OR author ILIKE %s
                       ORDER BY published_date DESC''',
                    (f'%{search}%', f'%{search}%', f'%{search}%')
                )
            else:
                cursor.execute(
                    'SELECT * FROM interviews ORDER BY published_date DESC'
                )
            
            interviews = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps([dict(row) for row in interviews], default=str)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            required_fields = ['title', 'content']
            for field in required_fields:
                if field not in body_data:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': f'Missing required field: {field}'})
                    }
            
            cursor.execute(
                '''INSERT INTO interviews 
                   (title, subtitle, content, author, image_url, category, is_published)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)
                   RETURNING *''',
                (
                    body_data['title'],
                    body_data.get('subtitle'),
                    body_data['content'],
                    body_data.get('author'),
                    body_data.get('image_url'),
                    body_data.get('category', 'interview'),
                    body_data.get('is_published', True)
                )
            )
            
            new_interview = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(dict(new_interview), default=str)
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            interview_id = body_data.get('id')
            
            if not interview_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Missing interview id'})
                }
            
            update_fields = []
            update_values = []
            
            allowed_fields = ['title', 'subtitle', 'content', 'author', 'image_url', 'category', 'is_published']
            for field in allowed_fields:
                if field in body_data:
                    update_fields.append(f'{field} = %s')
                    update_values.append(body_data[field])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            update_fields.append('updated_date = CURRENT_TIMESTAMP')
            update_values.append(interview_id)
            
            query = f'''UPDATE interviews 
                       SET {', '.join(update_fields)}
                       WHERE id = %s
                       RETURNING *'''
            
            cursor.execute(query, update_values)
            updated_interview = cursor.fetchone()
            
            if not updated_interview:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Interview not found'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(dict(updated_interview), default=str)
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            interview_id = params.get('id')
            
            if not interview_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Missing interview id'})
                }
            
            cursor.execute(
                'DELETE FROM interviews WHERE id = %s RETURNING id',
                (interview_id,)
            )
            
            deleted = cursor.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Interview not found'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Interview deleted successfully'})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
