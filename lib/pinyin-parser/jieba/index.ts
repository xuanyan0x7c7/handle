import module from './jieba.wasm';

interface WasmExports extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  cut(a: number, b: number, c: number, d: boolean): void;
  cut_all(a: number, b: number, c: number): void;
  cut_for_search(a: number, b: number, c: number, d: boolean): void;
  tokenize(a: number, b: number, c: number, d: number, e: number, f: boolean): void;
  add_word(a: number, b: number, c: boolean, d: number, e: number, f: number): number;
  __wbindgen_malloc(a: number): number;
  __wbindgen_realloc(a: number, b: number, c: number): number;
  __wbindgen_add_to_stack_pointer(a: number): number;
  __wbindgen_free(a: number, b: number): void;
}

let wasm: WasmExports | null = null;

const heap = new Array(32).fill(undefined);
heap.push(undefined, null, true, false);

let heapNext = heap.length;

function getObject(idx: number) {
  return heap[idx];
}

function dropObject(idx: number) {
  if (idx < 36) return;
  heap[idx] = heapNext;
  heapNext = idx;
}

function takeObject(idx: number) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

function addHeapObject(obj: any) {
  if (heapNext === heap.length) {
    heap.push(heap.length + 1);
  }
  const idx = heapNext;
  heapNext = heap[idx];

  heap[idx] = obj;
  return idx;
}

function debugString(val: any): string {
  if (typeof val === 'number' || typeof val === 'boolean' || val == null) {
    return `${val}`;
  }
  if (typeof val === 'string') {
    return val;
  }
  if (typeof val === 'symbol') {
    const description = val.description;
    if (description == null) {
      return 'Symbol';
    } else {
      return `Symbol(${description})`;
    }
  }
  if (typeof val == 'function') {
    const name = val.name;
    if (typeof name == 'string' && name.length > 0) {
      return `Function(${name})`;
    } else {
      return 'Function';
    }
  }
  if (Array.isArray(val)) {
    return val.map(debugString).join(', ');
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches!.length > 1) {
    className = builtInMatches![1];
  } else {
    return toString.call(val);
  }
  if (className === 'Object') {
    try {
      return `Object(${JSON.stringify(val)})`;
    } catch (_) {
      return 'Object';
    }
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  return className;
}

let WASM_VECTOR_LEN = 0;

let cachegetUint8Memory0: Uint8Array | null = null;
function getUint8Memory0() {
  if (cachegetUint8Memory0?.buffer !== wasm!.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm!.memory.buffer);
  }
  return cachegetUint8Memory0;
}

let cachegetInt32Memory0: Int32Array | null = null;
function getInt32Memory0() {
  if (cachegetInt32Memory0?.buffer !== wasm!.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm!.memory.buffer);
  }
  return cachegetInt32Memory0;
}

let cachegetUint32Memory0: Uint32Array | null = null;
function getUint32Memory0() {
  if (cachegetUint32Memory0?.buffer !== wasm!.memory.buffer) {
    cachegetUint32Memory0 = new Uint32Array(wasm!.memory.buffer);
  }
  return cachegetUint32Memory0;
}

const cachedTextEncoder = new TextEncoder();

function encodeString(arg: string, view: Uint8Array) {
  if (typeof cachedTextEncoder.encodeInto === 'function') {
    return cachedTextEncoder.encodeInto(arg, view) as { read: number; written: number };
  } else {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length,
    };
  }
}

function passStringToWasm0(
  arg: string,
  malloc: WasmExports['__wbindgen_malloc'],
  realloc: WasmExports['__wbindgen_realloc'],
) {
  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) {
      break;
    }
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();

function getStringFromWasm0(ptr: number, len: number) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function getArrayJsValueFromWasm0(ptr: number, len: number) {
  const mem = getUint32Memory0();
  const slice = mem.subarray(ptr / 4, ptr / 4 + len);
  const result = [];
  for (const x of slice) {
    result.push(takeObject(x));
  }
  return result;
}

export function cut(text: string, hmm: boolean): string[] {
  try {
    const retptr = wasm!.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(text, wasm!.__wbindgen_malloc, wasm!.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm!.cut(retptr, ptr0, len0, hmm);
    const r0 = getInt32Memory0()[retptr / 4 + 0];
    const r1 = getInt32Memory0()[retptr / 4 + 1];
    const v1 = getArrayJsValueFromWasm0(r0, r1).slice();
    wasm!.__wbindgen_free(r0, r1 * 4);
    return v1;
  } finally {
    wasm!.__wbindgen_add_to_stack_pointer(16);
  }
}

export function cutAll(text: string): string[] {
  try {
    const retptr = wasm!.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(text, wasm!.__wbindgen_malloc, wasm!.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm!.cut_all(retptr, ptr0, len0);
    const r0 = getInt32Memory0()[retptr / 4 + 0];
    const r1 = getInt32Memory0()[retptr / 4 + 1];
    const v1 = getArrayJsValueFromWasm0(r0, r1).slice();
    wasm!.__wbindgen_free(r0, r1 * 4);
    return v1;
  } finally {
    wasm!.__wbindgen_add_to_stack_pointer(16);
  }
}

export function cutForSearch(text: string, hmm: boolean): string[] {
  try {
    const retptr = wasm!.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(text, wasm!.__wbindgen_malloc, wasm!.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm!.cut_for_search(retptr, ptr0, len0, hmm);
    const r0 = getInt32Memory0()[retptr / 4 + 0];
    const r1 = getInt32Memory0()[retptr / 4 + 1];
    const v1 = getArrayJsValueFromWasm0(r0, r1).slice();
    wasm!.__wbindgen_free(r0, r1 * 4);
    return v1;
  } finally {
    wasm!.__wbindgen_add_to_stack_pointer(16);
  }
}

export function tokenize(text: string, mode: string, hmm: boolean): { word: string; start: number; end: number }[] {
  try {
    const retptr = wasm!.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(text, wasm!.__wbindgen_malloc, wasm!.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(mode, wasm!.__wbindgen_malloc, wasm!.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    wasm!.tokenize(retptr, ptr0, len0, ptr1, len1, hmm);
    const r0 = getInt32Memory0()[retptr / 4 + 0];
    const r1 = getInt32Memory0()[retptr / 4 + 1];
    const v2 = getArrayJsValueFromWasm0(r0, r1).slice();
    wasm!.__wbindgen_free(r0, r1 * 4);
    return v2;
  } finally {
    wasm!.__wbindgen_add_to_stack_pointer(16);
  }
}

export function addWord(word: string, freq: number | null, tag: string | null): number {
  const ptr0 = passStringToWasm0(word, wasm!.__wbindgen_malloc, wasm!.__wbindgen_realloc);
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = tag == null ? 0 : passStringToWasm0(tag, wasm!.__wbindgen_malloc, wasm!.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  const ret = wasm!.add_word(ptr0, len0, freq != null, freq == null ? 0 : freq, ptr1, len1);
  return ret >>> 0;
}

export async function init() {
  if (wasm == null) {
    const wasmModule = await module({
      wbg: {
        __wbindgen_object_drop_ref(arg0: number) {
          takeObject(arg0);
        },
        __wbindgen_string_new(arg0: number, arg1: number) {
          const ret = getStringFromWasm0(arg0, arg1);
          return addHeapObject(ret);
        },
        __wbg_new_68adb0d58759a4ed() {
          const ret = {};
          return addHeapObject(ret);
        },
        __wbindgen_number_new(arg0: any) {
          const ret = arg0;
          return addHeapObject(ret);
        },
        __wbg_set_2e79e744454afade(arg0: number, arg1: number, arg2: number) {
          getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
        },
        __wbindgen_object_clone_ref(arg0: number) {
          const ret = getObject(arg0);
          return addHeapObject(ret);
        },
        __wbg_new_55259b13834a484c(arg0: number, arg1: number) {
          const ret = new Error(getStringFromWasm0(arg0, arg1));
          return addHeapObject(ret);
        },
        __wbindgen_debug_string(arg0: number, arg1: number) {
          const ret = debugString(getObject(arg1));
          const ptr0 = passStringToWasm0(ret, wasm!.__wbindgen_malloc, wasm!.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len0;
          getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        },
        __wbindgen_throw(arg0: number, arg1: number) {
          throw new Error(getStringFromWasm0(arg0, arg1));
        },
      },
    });
    wasm = wasmModule as WasmExports;
  }
}
