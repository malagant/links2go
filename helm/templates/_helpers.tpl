{{/*
Expand the name of the chart.
*/}}
{{- define "links2go.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "links2go.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "links2go.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "links2go.labels" -}}
helm.sh/chart: {{ include "links2go.chart" . }}
{{ include "links2go.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "links2go.selectorLabels" -}}
app.kubernetes.io/name: {{ include "links2go.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Frontend labels
*/}}
{{- define "links2go.frontend.labels" -}}
{{ include "links2go.labels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Frontend selector labels
*/}}
{{- define "links2go.frontend.selectorLabels" -}}
{{ include "links2go.selectorLabels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Backend labels
*/}}
{{- define "links2go.backend.labels" -}}
{{ include "links2go.labels" . }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Backend selector labels
*/}}
{{- define "links2go.backend.selectorLabels" -}}
{{ include "links2go.selectorLabels" . }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "links2go.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "links2go.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Redis connection string
*/}}
{{- define "links2go.redisHost" -}}
{{- if .Values.redis.enabled }}
{{- printf "%s-redis-master" (include "links2go.fullname" .) }}
{{- else }}
{{- .Values.externalRedis.host }}
{{- end }}
{{- end }}

{{/*
Redis port
*/}}
{{- define "links2go.redisPort" -}}
{{- if .Values.redis.enabled }}
{{- .Values.redis.master.service.ports.redis | default 6379 }}
{{- else }}
{{- .Values.externalRedis.port | default 6379 }}
{{- end }}
{{- end }}

{{/*
Frontend URL for CORS
*/}}
{{- define "links2go.frontendUrl" -}}
{{- if .Values.ingress.enabled }}
{{- if .Values.ingress.tls }}
{{- printf "https://%s" (index .Values.ingress.hosts 0).host }}
{{- else }}
{{- printf "http://%s" (index .Values.ingress.hosts 0).host }}
{{- end }}
{{- else }}
{{- printf "http://localhost:3000" }}
{{- end }}
{{- end }}

{{/*
Base URL for the application
*/}}
{{- define "links2go.baseUrl" -}}
{{- if .Values.ingress.enabled }}
{{- if .Values.ingress.tls }}
{{- printf "https://%s" (index .Values.ingress.hosts 0).host }}
{{- else }}
{{- printf "http://%s" (index .Values.ingress.hosts 0).host }}
{{- end }}
{{- else }}
{{- printf "http://localhost:3001" }}
{{- end }}
{{- end }}