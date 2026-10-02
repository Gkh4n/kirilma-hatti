#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${ANDROID_TOOLS:?}" "${ANDROID_JAR:?}" "${ECJ_JAR:?}" "${SIGNING_KEY:?}" "${SIGNING_PASSWORD_FILE:?}" "${APK_OUTPUT:?}"
# Only generated compiler outputs are removed; release keys are external.
rm -rf android/build/classes android/build/dex
mkdir -p android/build/classes android/build/dex android/assets
cp index.html android/assets/index.html
java -jar "$ECJ_JAR" -1.8 -nowarn -bootclasspath "$ANDROID_JAR" -d android/build/classes android/src/tr/kirilmahatti/game/MainActivity.java
"$ANDROID_TOOLS/aapt" package -f -M android/AndroidManifest.xml -S android/res -A android/assets -I "$ANDROID_JAR" -F android/build/unsigned.apk
mapfile -t classfiles < <(find android/build/classes -name '*.class')
"$ANDROID_TOOLS/d8" --lib "$ANDROID_JAR" --min-api 23 --output android/build/dex "${classfiles[@]}"
python3 - <<'PY'
from zipfile import ZipFile
from pathlib import Path
assert Path('android/build/dex/classes.dex').read_bytes().startswith(b'dex\n')
with ZipFile('android/build/unsigned.apk','a') as z:z.write('android/build/dex/classes.dex','classes.dex')
PY
"$ANDROID_TOOLS/zipalign" -f 4 android/build/unsigned.apk android/build/aligned.apk
"$ANDROID_TOOLS/apksigner" sign --ks "$SIGNING_KEY" --ks-pass "file:$SIGNING_PASSWORD_FILE" --out "$APK_OUTPUT" android/build/aligned.apk
"$ANDROID_TOOLS/apksigner" verify --verbose "$APK_OUTPUT"
