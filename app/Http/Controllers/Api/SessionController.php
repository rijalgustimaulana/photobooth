<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PhotoboothSession;

class SessionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'mode' => 'nullable|in:single,sequence',
        ]);

        $session = PhotoboothSession::create([
            'user_id' => $request->user()->id,
            'mode' => $request->mode ?? 'sequence',
            'status' => 'draft'
        ]);

        return response()->json([
            'session_id' => $session->id,
            'mode' => $session->mode,
            'status' => $session->status
        ], 201);
    }
}
