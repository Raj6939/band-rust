use obi::{OBIDecode, OBIEncode, OBISchema};
use owasm_kit::{execute_entry_point, prepare_entry_point, oei, ext};

#[derive(OBIDecode, OBISchema)]
struct Input {
    addr: String,
    bear_token: String,
}

#[derive(OBIEncode, OBISchema)]
struct Output {
    response: String,
}

const DATA_SOURCE_ID: i64 = 39;
const EXTERNAL_ID: i64 = 0;

#[no_mangle]
fn prepare_impl(input: Input) {
    oei::ask_external_data(
        EXTERNAL_ID,
        DATA_SOURCE_ID,
        format!("{} {}", input.addr, input.bear_token).as_bytes(),
    )
}

#[no_mangle]
fn execute_impl(_: Input) -> Output {
    Output { response: ext::load_majority::<String>(EXTERNAL_ID).unwrap() }
}

prepare_entry_point!(prepare_impl);
execute_entry_point!(execute_impl);