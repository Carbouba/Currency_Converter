from django.core.serializers import json
from django.http import JsonResponse
from django.shortcuts import render
import requests

from decouple import config
from django.views.decorators.http import require_GET

api_key = config('API_KEY')
headers = {
    "Authorization": f"Bearer {api_key}"
}
# url = 'https://allratestoday.com/api/v1/rates'
get_symbole_urls = 'https://allratestoday.com/api/v1/symbols'


def index(request):
    return render(request, 'ConverApp/index.html')


@require_GET
def convert_currency(request):

    source = request.GET.get('source')
    target = request.GET.get('target')
    amount = request.GET.get('amount')

    try:
        float(amount)
    except ValueError:
        return JsonResponse({'error': 'Entrez un montant valide'})

    if not source or not target:
        return JsonResponse({'error': 'source et target requis'}, status=400)

    params = {
        "source": source,
        "target": target,
        "amount": amount,
    }

    try:
        response = requests.get(url=url, params=params,
                                headers=headers, timeout=5)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': 'Erreur API externe'}, status=502)

    return JsonResponse(response.json())

@require_GET
def get_symbols(request):
    try:
        response = requests.get(get_symbole_urls)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': 'Erreur API externe'}, status=502)

    return JsonResponse(response.json())